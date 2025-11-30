import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

// Tipos
type Member = { id: string; name: string; role: string };
type Squad = { id: string; name: string; members: Member[] };

// Prop do Modal
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

  // Adiciona membro à lista de membros temporários
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

  // Remove membro da lista de membros temporários
  const removeMember = (id: string) => {
    setTempMembers(tempMembers.filter(m => m.id !== id));
  };

  // Envia a squad para salvar ou editar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome da squad é obrigatório.");
      return;
    }

    const squadData: Squad = {
      id: squadToEdit?.id || `s-${Date.now()}`,
      name,
      members: tempMembers,
    };

    onSave(squadData);
  };

  // Filtra membros por papel
  const monitors = tempMembers.filter(m => m.role !== "Estagiário");
  const interns = tempMembers.filter(m => m.role === "Estagiário");

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
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

          {/* Seção PEO / Líderes */}
          <div className="form-section">
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

export default SquadModal;
