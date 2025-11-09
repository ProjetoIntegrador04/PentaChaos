import React, { useMemo, useState } from "react";
import { FiPlus, FiEdit, FiUsers, FiDownload, FiX, FiTrash2 } from "react-icons/fi";

import "../../styles/Coordinator/Users.css";
import "../../styles/Coordinator/Squads.css";

// --- Tipos ---
type Member = { id: string; name: string; role: string };
type Squad = { id: string; name: string; members: Member[] };

// --- Dados Mocado ---
const mockSquads: Squad[] = [
  {
    id: "s1",
    name: "Squad LSD",
    members: [
      { id: "m1", name: "Ivan", role: "PEO" },
      { id: "m2", name: "Webber", role: "Estagiário" },
      { id: "m3", name: "Cléo", role: "Estagiário" },
      { id: "m4", name: "Rods", role: "Estagiário" },
    ],
  },
  { id: "s2", name: "Squad CASE", members: [{ id: "m5", name: "Júlio", role: "Tech Lead" }] },
  { id: "s3", name: "Squad INFRA", members: [{ id: "m6", name: "Carlos", role: "DevOps" }] },
];

// =========================================
// COMPONENTE: Modal de Cadastro/Edição
// =========================================
interface SquadModalProps {
  squadToEdit?: Squad | null; // Nova prop opcional para edição
  onClose: () => void;
  onSave: (squad: Squad) => void;
}

const SquadModal: React.FC<SquadModalProps> = ({ squadToEdit, onClose, onSave }) => {
  // Inicializa os estados com os dados da squad se estiver editando, ou vazio se for nova
  const [name, setName] = useState(squadToEdit?.name || "");
  const [tempMembers, setTempMembers] = useState<Member[]>(squadToEdit?.members || []);
  
  const [monitorInput, setMonitorInput] = useState("");
  const [internInput, setInternInput] = useState("");

  const addMember = (nameStr: string, role: string, setInput: (val: string) => void) => {
    if (!nameStr.trim()) return;
    const newMember: Member = {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: nameStr.trim(),
      role: role,
    };
    setTempMembers([...tempMembers, newMember]);
    setInput("");
  };

  const removeMember = (id: string) => {
    setTempMembers(tempMembers.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome da squad é obrigatório.");
      return;
    }

    const squadData: Squad = {
      // Se estiver editando, mantém o ID. Se for nova, cria um novo ID.
      id: squadToEdit?.id || `s-${Date.now()}`,
      name,
      members: tempMembers,
    };

    onSave(squadData);
  };

  // Filtra membros por papel para exibição
  // Considerando PEO, Tech Lead, Monitor como "Líderes" para este filtro
  const monitors = tempMembers.filter(m => m.role !== "Estagiário");
  const interns = tempMembers.filter(m => m.role === "Estagiário");

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          {/* Título dinâmico */}
          <h2>{squadToEdit ? "Editar Squad" : "Cadastrar Nova Squad"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome da Squad</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Squad Rocket"
              required
            />
          </div>

          {/* Seção PEO / Monitores */}
          <div className="form-section">
            {/* Label atualizado conforme solicitado */}
            <label>PEO / Líderes</label>
            <div className="input-with-action">
              <input 
                type="text" 
                value={monitorInput}
                onChange={(e) => setMonitorInput(e.target.value)}
                placeholder="Nome do PEO ou líder"
              />
              <button 
                type="button" 
                className="icon-btn add-small"
                onClick={() => addMember(monitorInput, "PEO", setMonitorInput)}
              >
                <FiPlus />
              </button>
            </div>
            <ul className="member-chips-list">
              {monitors.map(m => (
                <li key={m.id} className="member-chip monitor">
                  {/* Mostra o cargo também para diferenciar PEO de Tech Lead se quiser */}
                  <span>{m.name} <small>({m.role})</small></span>
                  <button type="button" onClick={() => removeMember(m.id)}>
                    <FiX size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Seção Estagiários */}
          <div className="form-section">
            <label>Estagiários</label>
            <div className="input-with-action">
              <input 
                type="text" 
                value={internInput}
                onChange={(e) => setInternInput(e.target.value)}
                placeholder="Nome do estagiário"
              />
              <button 
                type="button" 
                className="icon-btn add-small"
                onClick={() => addMember(internInput, "Estagiário", setInternInput)}
              >
                <FiPlus />
              </button>
            </div>
            <ul className="member-chips-list">
              {interns.map(m => (
                <li key={m.id} className="member-chip intern">
                  <span>{m.name}</span>
                  <button type="button" onClick={() => removeMember(m.id)}>
                    <FiX size={14} />
                  </button>
                </li>
              ))}
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

// =========================================
// COMPONENTE PRINCIPAL
// =========================================
export default function Squads() {
  const [squads, setSquads] = useState<Squad[]>(mockSquads);
  const [selectedId, setSelectedId] = useState<string>(mockSquads[0].id);
  const [busca, setBusca] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Novo estado para saber qual squad estamos editando (null = criando nova)
  const [squadToEdit, setSquadToEdit] = useState<Squad | null>(null);

  const squadsFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return q ? squads.filter((s) => s.name.toLowerCase().includes(q)) : squads;
  }, [busca, squads]);

  const selected = useMemo(() => {
    const fromFilter = squadsFiltrados.find((s) => s.id === selectedId);
    return fromFilter ?? squadsFiltrados[0] ?? null;
  }, [selectedId, squadsFiltrados]);

  // Abre o modal em modo de criação
  const handleCreateNew = () => {
    setSquadToEdit(null);
    setIsModalOpen(true);
  };

  // Abre o modal em modo de edição
  const handleEditClick = (squad: Squad, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita selecionar a squad ao clicar no botão de editar
    setSquadToEdit(squad);
    setIsModalOpen(true);
  };

  // Salva (cria ou atualiza)
  const handleSaveSquad = (savedSquad: Squad) => {
    setSquads((prev) => {
      const exists = prev.some(s => s.id === savedSquad.id);
      if (exists) {
        // Atualiza existente
        return prev.map(s => s.id === savedSquad.id ? savedSquad : s);
      } else {
        // Adiciona nova
        return [...prev, savedSquad];
      }
    });
    
    setIsModalOpen(false);
    setSquadToEdit(null);
    if (!squadToEdit) setSelectedId(savedSquad.id); // Se criou nova, seleciona ela
  };

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Squads</h1>
        <div className="header-actions">
          <button className="report-btn">
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
          placeholder="Pesquise..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="squads-content">
        <aside className="teams-panel">
          <h2>Equipes</h2>
          <ul className="teams-list">
            {squadsFiltrados.map((s) => {
              const isActive = selected?.id === s.id;
              return (
                <li
                  key={s.id}
                  className={`team-item ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className="team-info">
                    <span className="team-name">{s.name}</span>
                    <span className="team-count">
                      <FiUsers size={14} /> {s.members.length}
                    </span>
                  </div>
                  {/* Botão de Editar na lista lateral */}
                  <button 
                    className="icon-btn edit-small" 
                    onClick={(e) => handleEditClick(s, e)}
                    title="Editar Squad"
                  >
                    <FiEdit size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="members-card">
          {/* Tabela de membros (sem alterações na lógica de exibição) */}
          <table className="members-table">
            <thead>
              <tr>
                <th>Integrantes</th>
                <th>Função</th>
                {/* Removi a coluna 'Editar' daqui pois estamos editando a SQUAD inteira agora, 
                    mas você pode manter se quiser editar membros individualmente depois */}
              </tr>
            </thead>
            <tbody>
              {selected?.members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td className="role">{m.role}</td>
                </tr>
              ))}
              {!selected && (
                <tr><td colSpan={2} className="empty-row">Selecione uma squad.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {isModalOpen && (
        <SquadModal 
          squadToEdit={squadToEdit}
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveSquad} 
        />
      )}
    </div>
  );
}