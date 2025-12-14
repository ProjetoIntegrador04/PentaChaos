import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit, FiUsers, FiDownload, FiX, FiTrash2 } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../../styles/Coordinator/Users.css";
import "../../styles/Coordinator/Squads.css";
import api from "../../api/https";

// =============================
// TIPOS
// =============================
interface Role {
  id: number;
  name: string;
}

interface Usuario {
  id: number;
  username: string;
  email: string;
  ra: string;
  squad: string;
  enabled: boolean;
  roles: Role[];
  emailPessoal?: string;
}

interface Squad {
  id?: number;  // ID do squad (vem do backend)
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
  console.log("🎯 MODAL ABERTO!");
  console.log("📊 Dados recebidos:", { 
    totalUsuarios: allUsers.length, 
    initialName, 
    initialMembers: initialMembers.length 
  });
  
  const [name, setName] = useState(initialName || "");
  const [selectedMembers, setSelectedMembers] = useState<Usuario[]>(
    initialMembers
  );

  const [searchTerm, setSearchTerm] = useState("");

  // Lista de todos os estagiários (ROLE_USER)
  const allInterns = useMemo(() => {
    console.log("🔍 MODAL - allUsers recebidos:", allUsers.length, allUsers);
    console.log("🔍 MODAL - Exemplo de roles:", allUsers[0]?.roles);
    
    const interns = allUsers.filter((u) => u.roles.some(r => r.name === "ROLE_USER"));
    console.log("👥 MODAL - Estagiários filtrados:", interns.length, interns.map(u => ({ id: u.id, username: u.username, roles: u.roles })));
    
    if (interns.length === 0) {
      console.warn("⚠️ MODAL - NENHUM ESTAGIÁRIO ENCONTRADO!");
      console.warn("⚠️ MODAL - Verificar se usuários têm ROLE_USER");
    }
    
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
  const [squadsFromBackend, setSquadsFromBackend] = useState<Array<{id: number; name: string; memberCount: number; members: Array<{id: number; username: string; fullName?: string}>}>>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [selectedSquadName, setSelectedSquadName] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSquadName, setEditingSquadName] = useState<
    string | undefined
  >(undefined);

  // Carregar usuários E squads do backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários
      const usersRes = await api.get<Usuario[]>("/api/v1/users");
      console.log("📡 Usuários carregados:", usersRes.data);
      
      // Buscar squads da API
      const squadsRes = await api.get("/api/v1/squads");
      console.log("📡 Squads carregadas da API:", squadsRes.data);
      setSquadsFromBackend(squadsRes.data || []);
      
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error("❌ Erro ao buscar dados:", err);
      
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        alert("Sessão expirada! Por favor, faça login novamente.");
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
    // Usar squads do backend (suporta múltiplas squads por usuário)
    const list: Squad[] = squadsFromBackend.map(squad => {
      const members: Usuario[] = squad.members.map(member => {
        // Encontrar dados completos do usuário
        const fullUser = users.find(u => u.id === member.id);
        return fullUser || {
          id: member.id,
          username: member.username,
          email: "",
          fullName: member.fullName || member.username,
          ra: "",
          squad: squad.name,
          enabled: true,
          roles: []
        };
      });
      
      return {
        id: squad.id,
        name: squad.name,
        members
      };
    });

    console.log("📋 Squads do backend:", list.map(s => ({ id: s.id, name: s.name, membros: s.members.length })));

    const term = busca.trim().toLowerCase();
    return term
      ? list.filter((s) => s.name.toLowerCase().includes(term))
      : list;
  }, [squadsFromBackend, users, busca]);

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
    const newName = data.name.trim();
    const memberIdsSet = new Set(data.memberIds);

    const oldName = editingSquadName;

    console.log("📡 Salvando squad:", { newName, memberIds: Array.from(memberIdsSet), isEditing: !!oldName });

    // Validar que há pelo menos 1 membro
    if (memberIdsSet.size === 0) {
      alert("Selecione pelo menos 1 estagiário para a squad!");
      return;
    }

    try {
      // 1. Se for uma NOVA squad, criar a entidade Squad no backend PRIMEIRO
      if (!oldName) {
        console.log(`🆕 Criando entidade Squad: ${newName}`);
        try {
          await api.post("/api/v1/squads", {
            name: newName,
            description: `Squad ${newName}`,
          });
          console.log("✅ Squad criada no backend!");
        } catch (error: any) {
          if (error.response?.status === 409 || error.response?.data?.message?.includes("já existe")) {
            console.log("⚠️ Squad já existe no backend, continuando...");
          } else {
            console.error("❌ Erro ao criar squad:", error);
            alert("Erro ao criar squad: " + (error.response?.data?.message || error.message));
            return;
          }
        }
      }

      // 2. Adicionar membros à squad usando o endpoint correto
      const requests: Promise<unknown>[] = [];

      // Se estiver editando, remover membros que não estão mais na lista
      if (oldName != null) {
        const oldSquad = squads.find(s => s.name === oldName);
        if (oldSquad && oldSquad.members) {
          const oldMemberIds = new Set(oldSquad.members.map(m => m.id));
          oldMemberIds.forEach((memberId) => {
            if (!memberIdsSet.has(memberId)) {
              console.log(`🔄 Removendo membro ${memberId} da squad ${oldName}`);
              requests.push(
                api.delete(`/api/v1/squads/${oldSquad.id}/members/${memberId}`)
              );
            }
          });
        }
      }

      // Adicionar novos membros à squad usando POST /squads/{id}/members
      const currentSquad = squads.find(s => s.name === newName);
      if (currentSquad) {
        const currentMemberIds = new Set(currentSquad.members?.map(m => m.id) || []);
        
        memberIdsSet.forEach((userId: number) => {
          // Só adiciona se o usuário NÃO estiver na squad
          if (!currentMemberIds.has(userId)) {
            console.log(`➕ Adicionando usuário ${userId} à squad ${newName}`);
            requests.push(
              api.post(`/api/v1/squads/${currentSquad.id}/members`, {
                userId: userId
              })
            );
          } else {
            console.log(`✓ Usuário ${userId} já está na squad ${newName}`);
          }
        });
      }

      console.log(`🚀 Executando ${requests.length} requisições de atualização...`);
      
      if (requests.length > 0) {
        await Promise.all(requests);
      }
      
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

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const date = new Date().toLocaleDateString("pt-BR");
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    // Cabeçalho colorido
    doc.setFillColor(139, 92, 246); // Roxo
    doc.rect(0, 0, pageWidth, 35, "F");

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Squads e Integrantes", pageWidth / 2, 15, { align: "center" });

    // Informações da data
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${date}`, pageWidth / 2, 23, { align: "center" });
    doc.text(`Hora: ${time}`, pageWidth / 2, 28, { align: "center" });

    // Resetar cor do texto
    doc.setTextColor(0, 0, 0);

    let startY = 40;

    // Gerar tabela para cada squad
    squads.forEach((squad, idx) => {
      if (idx > 0) {
        startY += 15; // Espaço entre squads
      }

      // Título da squad
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text(`Squad: ${squad.name}`, 14, startY);
      doc.setTextColor(0, 0, 0);

      startY += 5;

      // Dados dos membros
      const tableData = squad.members.map((m) => {
        const isAdmin = m.roles.some(r => r.name === "ROLE_ADMIN");
        const roleLabel = isAdmin ? "👑 Admin" : "👤 Estagiário";
        const statusIcon = m.enabled ? "✓" : "✗";
        
        return [
          m.username,
          m.email,
          m.ra || "-",
          roleLabel,
          statusIcon + " " + (m.enabled ? "ATIVO" : "INATIVO")
        ];
      });

      // Gerar tabela
      autoTable(doc, {
        startY: startY,
        head: [["Nome", "Email", "RA", "Cargo", "Status"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [139, 92, 246],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 50 }, // Nome
          1: { cellWidth: 70 }, // Email
          2: { cellWidth: 30, halign: "center" }, // RA
          3: { cellWidth: 35, halign: "center" }, // Cargo
          4: { cellWidth: 30, halign: "center" }, // Status
        },
        didDrawCell: (data: any) => {
          // Colorir célula de status
          if (data.column.index === 4 && data.section === 'body') {
            const status = data.cell.text[0];
            if (status.includes("✓")) {
              doc.setTextColor(16, 185, 129); // Verde
            } else {
              doc.setTextColor(239, 68, 68); // Vermelho
            }
            doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
              align: "center",
              baseline: "middle"
            });
            doc.setTextColor(0, 0, 0);
          }
        },
      });

      startY = (doc as any).lastAutoTable.finalY;

      // Estatísticas da squad
      const totalMembers = squad.members.length;
      const activeMembers = squad.members.filter(m => m.enabled).length;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Total: ${totalMembers} integrantes | Ativos: ${activeMembers}`,
        14,
        startY + 5
      );
      doc.setTextColor(0, 0, 0);

      startY += 10;
    });

    // Rodapé
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalMembers = squads.reduce((sum, s) => sum + s.members.length, 0);
    
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Total geral: ${squads.length} squads | ${totalMembers} integrantes`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    
    doc.text(
      `Gerado automaticamente pelo Sistema PentaChaos - ${date} às ${time}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Salvar PDF
    const dateFile = new Date().toISOString().slice(0, 10);
    doc.save(`relatorio_squads_${dateFile}.pdf`);
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
                const isIntern = m.roles.some(r => r.name === "ROLE_USER");
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
