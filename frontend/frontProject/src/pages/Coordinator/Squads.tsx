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

  const [internInput, setInternInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const internSuggestions = useMemo(() => {
    const term = internInput.trim().toLowerCase();
    if (!term) return [];

    return allUsers.filter((u) => {
      const isIntern = u.roles.includes("ROLE_INTERN");
      const alreadyAdded = selectedMembers.some((m) => m.id === u.id);
      const matches =
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      return isIntern && !alreadyAdded && matches;
    });
  }, [internInput, allUsers, selectedMembers]);

  const handleAddMember = (user: Usuario) => {
    setSelectedMembers((prev) => [...prev, user]);
    setInternInput("");
    setShowSuggestions(false);
  };

  const handleRemoveMember = (id: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
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

          {/* Seção Estagiários com autocomplete */}
          <div className="form-section">
            <label>Estagiários</label>
            <div className="input-with-action">
              <input
                type="text"
                value={internInput}
                onChange={(e) => {
                  setInternInput(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Digite o nome do estagiário..."
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onFocus={() => {
                  if (internInput.trim()) setShowSuggestions(true);
                }}
              />
            </div>

            {showSuggestions && internSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {internSuggestions.map((u) => (
                  <li
                    key={u.id}
                    className="suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleAddMember(u)}
                  >
                    <span className="suggestion-name">{u.username}</span>
                    <span className="suggestion-email">{u.email}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="member-chips-list">
              {selectedMembers.map((m) => (
                <li key={m.id} className="member-chip intern">
                  <span>{m.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(m.id)}
                  >
                    <FiX size={14} />
                  </button>
                </li>
              ))}
              {selectedMembers.length === 0 && (
                <li className="empty-row">Nenhum estagiário selecionado.</li>
              )}
            </ul>
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
      const res = await api.get<Usuario[]>("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários para squads:", err);
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

      await Promise.all(
        members.map((m) =>
          api.put(`/users/${m.id}`, {
            squad: "",
          })
        )
      );

      await fetchUsers();
      alert("Squad excluída com sucesso!");

      if (selectedSquadName === squadName) {
        setSelectedSquadName(null);
      }
    } catch (err) {
      console.error("Erro ao excluir squad:", err);
      alert("Erro ao excluir squad.");
    }
  };

  const handleSaveSquad = async (data: { name: string; memberIds: number[] }) => {
    const newName = data.name;
    const memberIds = new Set(data.memberIds);

    const oldName = editingSquadName;

    try {
      const oldMembers =
        oldName != null
          ? users.filter((u) => u.squad === oldName)
          : [];

      const requests: Promise<any>[] = [];

      if (oldName != null) {
        oldMembers.forEach((u) => {
          if (!memberIds.has(u.id)) {
            requests.push(
              api.put(`/users/${u.id}`, {
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
          requests.push(
            api.put(`/users/${user.id}`, {
              squad: newName,
            })
          );
        }
      });

      await Promise.all(requests);
      await fetchUsers();
      alert("Squad salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar squad:", err);
      alert("Erro ao salvar squad.");
    } finally {
      setIsModalOpen(false);
      setEditingSquadName(undefined);
      if (data.name) setSelectedSquadName(data.name);
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
        const isIntern = m.roles.includes("ROLE_INTERN");
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
                const isIntern = m.roles.includes("ROLE_INTERN");
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
