import React, { useEffect, useState } from "react";
import { FiSave, FiX, FiUsers, FiEdit2 } from "react-icons/fi";
import "../../styles/Coordinator/ManageRoles.css";
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
  fullName: string | null;
  email: string;
  ra: string | null;
  squad: string | null;
  squadRole: string | null;
  roles: Role[];
}

interface Squad {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  members: Usuario[];
}

// Opções de funções disponíveis
const SQUAD_ROLES = [
  "Product Owner (P.O)",
  "Scrum Master",
  "Desenvolvedor Frontend",
  "Desenvolvedor Backend",
  "Desenvolvedor Full Stack",
  "Designer UI/UX",
  "Analista de Testes (QA)",
  "DevOps",
  "Arquiteto de Software",
  "Tech Lead"
];

// =============================
// COMPONENTE PRINCIPAL
// =============================
const ManageRoles: React.FC = () => {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [tempRole, setTempRole] = useState<string>("");

  // Carregar squads do backend
  const fetchSquads = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/squads");
      const squadsData = response.data as Squad[];
      
      console.log("📊 Squads carregadas:", squadsData);
      setSquads(squadsData);
      
      if (squadsData.length > 0) {
        setSelectedSquad(squadsData[0]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar squads:", error);
      alert("Erro ao carregar squads. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const handleEditRole = (userId: number, currentRole: string | null) => {
    setEditingUserId(userId);
    setTempRole(currentRole || "");
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setTempRole("");
  };

  const handleSaveRole = async (userId: number) => {
    if (!selectedSquad) return;
    
    try {
      console.log(`💾 Salvando função para usuário ${userId}:`, tempRole);
      
      await api.put(
        `/api/v1/squads/${selectedSquad.id}/members/${userId}/role`,
        { userId, squadRole: tempRole }
      );
      
      alert("Função atualizada com sucesso!");
      
      // Recarregar squads
      await fetchSquads();
      
      // Encontrar a squad atualizada
      const updatedSquadResponse = await api.get(`/api/v1/squads/${selectedSquad.id}`);
      setSelectedSquad(updatedSquadResponse.data);
      
      setEditingUserId(null);
      setTempRole("");
    } catch (error) {
      console.error("❌ Erro ao atualizar função:", error);
      alert("Erro ao atualizar função. Verifique o console.");
    }
  };

  if (loading) {
    return (
      <div className="manage-roles-page">
        <div className="loading-container">
          <p>Carregando squads...</p>
        </div>
      </div>
    );
  }

  if (squads.length === 0) {
    return (
      <div className="manage-roles-page">
        <header className="page-header">
          <h1>Gerenciar Squad e Funções</h1>
        </header>
        <div className="empty-state">
          <FiUsers size={64} color="#ccc" />
          <h2>Nenhuma squad cadastrada</h2>
          <p>Crie uma squad primeiro para gerenciar as funções dos membros.</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/squads'}
          >
            Ir para Squads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-roles-page">
      <header className="page-header">
        <h1>Gerenciar Squad e Funções</h1>
        <p>Defina a função de cada membro nas squads</p>
      </header>

      <div className="content-wrapper">
        {/* Sidebar com lista de squads */}
        <aside className="squads-sidebar">
          <h2>Squads</h2>
          <ul className="squads-list">
            {squads.map((squad) => (
              <li
                key={squad.id}
                className={`squad-item ${selectedSquad?.id === squad.id ? "active" : ""}`}
                onClick={() => setSelectedSquad(squad)}
              >
                <div className="squad-info">
                  <span className="squad-name">{squad.name}</span>
                  <span className="member-count">
                    <FiUsers size={14} /> {squad.memberCount}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Área principal com membros da squad selecionada */}
        <main className="members-section">
          {selectedSquad ? (
            <>
              <div className="section-header">
                <h2>{selectedSquad.name}</h2>
                <span className="member-badge">
                  {selectedSquad.memberCount} {selectedSquad.memberCount === 1 ? "membro" : "membros"}
                </span>
              </div>

              {selectedSquad.members.length === 0 ? (
                <div className="empty-members">
                  <p>Esta squad não possui membros ainda.</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => window.location.href = '/squads'}
                  >
                    Adicionar Membros
                  </button>
                </div>
              ) : (
                <div className="members-table-container">
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th>Nome de Usuário</th>
                        <th>Nome Completo</th>
                        <th>Função na Squad</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSquad.members.map((member) => (
                        <tr key={member.id}>
                          <td>{member.username}</td>
                          <td>{member.fullName || "-"}</td>
                          <td>
                            {editingUserId === member.id ? (
                              <select
                                className="role-select"
                                value={tempRole}
                                onChange={(e) => setTempRole(e.target.value)}
                              >
                                <option value="">Selecione uma função</option>
                                {SQUAD_ROLES.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`role-badge ${member.squadRole ? "" : "empty"}`}>
                                {member.squadRole || "Não definida"}
                              </span>
                            )}
                          </td>
                          <td>
                            {editingUserId === member.id ? (
                              <div className="action-buttons">
                                <button
                                  className="btn-icon btn-save"
                                  onClick={() => handleSaveRole(member.id)}
                                  title="Salvar"
                                >
                                  <FiSave size={18} />
                                </button>
                                <button
                                  className="btn-icon btn-cancel"
                                  onClick={handleCancelEdit}
                                  title="Cancelar"
                                >
                                  <FiX size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn-icon btn-edit"
                                onClick={() => handleEditRole(member.id, member.squadRole)}
                                title="Editar função"
                              >
                                <FiEdit2 size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="empty-selection">
              <p>Selecione uma squad ao lado para gerenciar as funções.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageRoles;
