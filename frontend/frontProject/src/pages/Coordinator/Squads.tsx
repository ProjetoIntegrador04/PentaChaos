import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit, FiUsers, FiDownload, FiX, FiTrash2 } from "react-icons/fi";

import "../../styles/Coordinator/Users.css";
import "../../styles/Coordinator/Squads.css";
import api from "../../api/https";

// =============================
// TIPOS
// =============================
interface Usuario {
  id: number;
  username: string;
  email: string;
  ra: string;
  squad: string;
  enabled: boolean;
  roles: string[];
  emailPessoal?: string;
}

interface Squad {
  name: string;
  members: Usuario[];
}

// =============================
// MODAL DE SQUAD
// =============================
interface SquadModalProps {
  allUsers: Usuario[];
  initialName?: string;
  initialMembers?: Usuario[];
  onClose: () => void;
  onSave: (data: { name: string; memberIds: number[] }) => void;
}

const SquadModal: React.FC<SquadModalProps> = ({
  allUsers,
  initialName,
  initialMembers = [],
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName || "");
  const [selectedMembers, setSelectedMembers] = useState<Usuario[]>(
    initialMembers
  );

  const [searchTerm, setSearchTerm] = useState("");

  // Lista de todos os estagiários (ROLE_USER)
  const allInterns = useMemo(() => {
    const interns = allUsers.filter((u) => u.roles.includes("ROLE_USER"));
    console.log("👥 Estagiários encontrados:", interns.length, interns.map(u => u.username));
    return interns;
  }, [allUsers]);

  // Estagiários filtrados pela busca
  const filteredInterns = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    // Se estiver vazio, retorna TODOS os estagiários
    if (!term) return allInterns;

    return allInterns.filter((u) => {
      return (
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.ra && u.ra.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, allInterns]);

  const handleToggleMember = (user: Usuario) => {
    const isSelected = selectedMembers.some((m) => m.id === user.id);
    
    if (isSelected) {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== user.id));
    } else {
      setSelectedMembers((prev) => [...prev, user]);
    }
  };

  const handleSelectAll = () => {
    setSelectedMembers([...filteredInterns]);
  };

  const handleDeselectAll = () => {
    setSelectedMembers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome da squad é obrigatório.");
      return;
    }

    const memberIds = selectedMembers.map((m) => m.id);
    onSave({ name: name.trim(), memberIds });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>{initialName ? "Editar Squad" : "Cadastrar Nova Squad"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome da Squad *</label>
            <input
              type="text"
              value={name}
              placeholder="Ex: Squad CASE"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Seção Estagiários com checklist */}
          <div className="form-section">
            <label>Estagiários ({selectedMembers.length} selecionados)</label>
            
            {/* Campo de busca - OPCIONAL */}
            {allInterns.length > 5 && (
              <div className="input-with-action">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar estagiário por nome, email ou RA..."
                />
              </div>
            )}

            {/* Botões de seleção */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSelectAll}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Selecionar Todos ({allInterns.length})
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDeselectAll}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Limpar Seleção
              </button>
            </div>

            {/* Lista com checkboxes */}
            <div className="checkbox-list-container" style={{ 
              maxHeight: '300px', 
              overflowY: 'auto', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              {allInterns.length === 0 && (
                <div style={{ textAlign: 'center', color: '#d32f2f', padding: '20px' }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                    ⚠️ Nenhum estagiário carregado
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Possíveis causas:
                    <br />• Sessão expirada (faça login novamente)
                    <br />• Nenhum usuário com ROLE_USER cadastrado
                    <br />• Erro de conexão com o servidor
                  </p>
                </div>
              )}
              {allInterns.length > 0 && filteredInterns.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  Nenhum estagiário encontrado com "{searchTerm}"
                </p>
              )}
              {filteredInterns.map((intern) => {
                const isSelected = selectedMembers.some((m) => m.id === intern.id);
                return (
                  <label
                    key={intern.id}
                    className="checkbox-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px',
                      marginBottom: '5px',
                      backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleMember(intern)}
                      style={{ marginRight: '10px', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: '#333' }}>{intern.username}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {intern.email}
                        {intern.ra && ` • RA: ${intern.ra}`}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="add-btn">
              Salvar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// =============================
// COMPONENTE PRINCIPAL
// =============================
const Squads: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [selectedSquadName, setSelectedSquadName] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSquadName, setEditingSquadName] = useState<
    string | undefined
  >(undefined);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // ✅ Endpoint correto
      const res = await api.get<Usuario[]>("/api/v1/users");
      console.log("📡 Usuários carregados para squads:", res.data);
      
      if (!res.data || res.data.length === 0) {
        console.warn("⚠️ Nenhum usuário retornado pela API. Verifique se está autenticado.");
      }
      
      setUsers(res.data || []);
    } catch (err) {
      console.error("❌ Erro ao buscar usuários para squads:", err);
      
      // Verificar se é erro de autenticação (401)
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        alert("Sessão expirada! Por favor, faça login novamente.");
        // Redirecionar para login
        window.location.href = "/login";
        return;
      }
      
      alert("Erro ao carregar dados de squads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const squads: Squad[] = useMemo(() => {
    const map = new Map<string, Usuario[]>();

    users.forEach((u) => {
      const squadName = u.squad?.trim();
      if (!squadName) return;
      if (!map.has(squadName)) map.set(squadName, []);
      map.get(squadName)!.push(u);
    });

    const list: Squad[] = Array.from(map.entries()).map(([name, members]) => ({
      name,
      members,
    }));

    console.log("📋 Squads calculadas:", list.map(s => ({ name: s.name, membros: s.members.length })));

    const term = busca.trim().toLowerCase();
    return term
      ? list.filter((s) => s.name.toLowerCase().includes(term))
      : list;
  }, [users, busca]);

  const selectedSquad: Squad | null = useMemo(() => {
    if (!squads.length) return null;
    if (selectedSquadName) {
      return squads.find((s) => s.name === selectedSquadName) ?? squads[0];
    }
    return squads[0];
  }, [squads, selectedSquadName]);

  const handleCreateNew = () => {
    setEditingSquadName(undefined);
    setIsModalOpen(true);
  };

  const handleEditSquad = (squadName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSquadName(squadName);
    setIsModalOpen(true);
  };

  const handleDeleteSquad = async (squadName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm(`Tem certeza que deseja excluir a squad "${squadName}"?`))
      return;

    try {
      const members = users.filter((u) => u.squad === squadName);

      // ✅ Endpoint correto
      await Promise.all(
        members.map((m) =>
          api.put(`/api/v1/users/${m.id}`, {
            squad: "",
          })
        )
      );

      console.log("✅ Squad excluída:", squadName);
      await fetchUsers();
      alert("Squad excluída com sucesso!");

      if (selectedSquadName === squadName) {
        setSelectedSquadName(null);
      }
    } catch (err) {
      console.error("❌ Erro ao excluir squad:", err);
      alert("Erro ao excluir squad. Verifique o console.");
    }
  };

  const handleSaveSquad = async (data: { name: string; memberIds: number[] }) => {
    const newName = data.name;
    const memberIds = new Set(data.memberIds);

    const oldName = editingSquadName;

    console.log("📡 Salvando squad:", { newName, memberIds: Array.from(memberIds), isEditing: !!oldName });

    // Validar que há pelo menos 1 membro
    if (memberIds.size === 0) {
      alert("Selecione pelo menos 1 estagiário para a squad!");
      return;
    }

    try {
      const oldMembers =
        oldName != null
          ? users.filter((u) => u.squad === oldName)
          : [];

      const requests: Promise<unknown>[] = [];

      if (oldName != null) {
        oldMembers.forEach((u) => {
          if (!memberIds.has(u.id)) {
            console.log(`🔄 Removendo ${u.username} da squad ${oldName}`);
            // ✅ Endpoint correto
            requests.push(
              api.put(`/api/v1/users/${u.id}`, {
                squad: "",
              })
            );
          }
        });
      }

      memberIds.forEach((userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        if (user.squad !== newName) {
          console.log(`➕ Adicionando ${user.username} à squad ${newName}`);
          // ✅ Endpoint correto
          requests.push(
            api.put(`/api/v1/users/${user.id}`, {
              squad: newName,
            })
          );
        }
      });

      console.log(`🚀 Executando ${requests.length} requisições...`);
      await Promise.all(requests);
      console.log("✅ Squad salva com sucesso!");
      
      // Recarregar usuários para atualizar a lista de squads
      await fetchUsers();
      
      // Fechar modal
      setIsModalOpen(false);
      setEditingSquadName(undefined);
      
      // Selecionar a squad criada/editada
      setSelectedSquadName(newName);
      
      alert(`Squad "${newName}" salva com sucesso!`);
    } catch (err) {
      console.error("❌ Erro ao salvar squad:", err);
      alert("Erro ao salvar squad. Verifique o console.");
    }
  };

  // ========= GERAR RELATÓRIO (CSV) =========
  const handleGenerateReport = () => {
    if (squads.length === 0) {
      alert("Não há squads para gerar relatório.");
      return;
    }

    const header = ["Squad", "Nome", "Email", "RA", "Função", "Status"];
    const rows: string[][] = [];

    squads.forEach((s) => {
      s.members.forEach((m) => {
        const isIntern = m.roles.includes("ROLE_USER");
        const roleLabel = isIntern ? "Estagiário" : "Líder / PEO";
        const status = m.enabled ? "ATIVO" : "INATIVO";

        rows.push([
          s.name,
          m.username,
          m.email,
          m.ra,
          roleLabel,
          status,
        ]);
      });
    });

    const escape = (value: string) => {
      const v = value ?? "";
      if (v.includes(";") || v.includes('"') || v.includes("\n")) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return v;
    };

    const csvContent =
      [header, ...rows]
        .map((row) => row.map(escape).join(";"))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute("download", `relatorio_squads_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Carregando squads...</p>;

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Squads</h1>
        <div className="header-actions">
          <button className="report-btn" onClick={handleGenerateReport}>
            <FiDownload size={16} /> Gerar relatório
          </button>
          <button className="add-btn" onClick={handleCreateNew}>
            <FiPlus size={16} /> Cadastrar squad
          </button>
        </div>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquise pelo nome da squad..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="squads-content">
        <aside className="teams-panel">
          <h2>Equipes</h2>
          <ul className="teams-list">
            {squads.map((s) => {
              const isActive = selectedSquad?.name === s.name;
              return (
                <li
                  key={s.name}
                  className={`team-item ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedSquadName(s.name)}
                >
                  <div className="team-info">
                    <span className="team-name">{s.name}</span>
                    <span className="team-count">
                      <FiUsers size={14} /> {s.members.length}
                    </span>
                  </div>

                  <button
                    className="icon-btn delete-small"
                    title="Excluir Squad"
                    onClick={(e) => handleDeleteSquad(s.name, e)}
                    style={{ color: "#ff4d4d" }}
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <button
                    className="icon-btn edit-small"
                    onClick={(e) => handleEditSquad(s.name, e)}
                    title="Editar Squad"
                  >
                    <FiEdit size={14} />
                  </button>
                </li>
              );
            })}
            {squads.length === 0 && (
              <li className="empty-row">Nenhuma squad cadastrada.</li>
            )}
          </ul>
        </aside>

        <section className="members-card">
          <table className="members-table">
            <thead>
              <tr>
                <th>Integrantes</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              {selectedSquad?.members.map((m) => {
                const isIntern = m.roles.includes("ROLE_USER");
                const roleLabel = isIntern ? "Estagiário" : "Líder / PEO";
                return (
                  <tr key={m.id}>
                    <td>{m.username}</td>
                    <td className="role">{roleLabel}</td>
                  </tr>
                );
              })}
              {!selectedSquad && (
                <tr>
                  <td colSpan={2} className="empty-row">
                    Nenhuma squad selecionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {isModalOpen && (
        <SquadModal
          allUsers={users}
          initialName={editingSquadName}
          initialMembers={
            editingSquadName
              ? users.filter((u) => u.squad === editingSquadName)
              : []
          }
          onClose={() => {
            setIsModalOpen(false);
            setEditingSquadName(undefined);
          }}
          onSave={handleSaveSquad}
        />
      )}
    </div>
  );
};

export default Squads;
