import React, { useState, useMemo } from "react";
// Adicionado FiCalendar, FiMessageSquare, FiStar para o novo modal
import { FiPlus, FiEdit, FiPower, FiDownload, FiX, FiCheck, FiCalendar, FiMessageSquare, FiStar } from "react-icons/fi"; 
import "../../styles/Coordinator/Users.css";

// --- Tipos ---
interface Usuario {
  id: number;
  status: "ATIVO" | "INATIVO";
  nome: string;
  ra: string;
  email: string;
  emailPessoal?: string;
  squad: string;
}

// --- Dados Mocado ---
const mockUsuarios: Usuario[] = [
  { id: 1, status: "ATIVO", nome: "David Franco", email: "david.franco@2rp.com", emailPessoal: "davi@gmail.com", ra: "554033", squad: "CASE" },
  { id: 2, status: "ATIVO", nome: "Maria Souza", email: "maria.souza@2rp.com", ra: "778899", squad: "CASE" },
  { id: 3, status: "INATIVO", nome: "João Silva", email: "joao.silva@2rp.com", ra: "112233", squad: "LSD" },
  { id: 4, status: "ATIVO", nome: "Thóris Merdeiros", email: "thoris@2rp.com", ra: "778865", squad: "LSD" },
  { id: 5, status: "INATIVO", nome: "Carlos Eduardo", email: "carlos@2rp.com", ra: "112267", squad: "INFRA" },
];

const AVAILABLE_SQUADS = ["CASE", "LSD", "INFRA", "PENTA", "DEVOPS", "404"];

// =========================================
// COMPONENTE: Modal de Cadastro/Edição (UserModal)
// =========================================
// ... (Mantenha o UserModal exatamente como estava na sua última versão) ...
// Vou omitir aqui para economizar espaço, mas NÃO O APAGUE do seu arquivo.
interface UserModalProps {
    userToEdit?: Usuario | null;
    onClose: () => void;
    onSave: (user: Usuario) => void;
}
const UserModal: React.FC<UserModalProps> = ({ userToEdit, onClose, onSave }) => {
    // ... COPIE O SEU CÓDIGO DO UserModal AQUI ...
    // (Se precisar que eu reenvie o código completo dele, me avise)
    const [formData, setFormData] = useState({
        nome: userToEdit?.nome || "",
        ra: userToEdit?.ra || "",
        emailPessoal: userToEdit?.emailPessoal || "",
        email: userToEdit?.email || "",
        squad: userToEdit?.squad || "",
        senha: "",
        confirmarSenha: "",
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.senha !== formData.confirmarSenha) { alert("As senhas não coincidem!"); return; }
        if (!formData.nome || !formData.email || !formData.ra || !formData.squad) { alert("Preencha os campos obrigatórios."); return; }
        const userToSave: Usuario = {
          id: userToEdit?.id || Date.now(),
          status: userToEdit?.status || "ATIVO",
          nome: formData.nome, ra: formData.ra, email: formData.email, emailPessoal: formData.emailPessoal, squad: formData.squad,
        };
        onSave(userToSave);
      };
    
      return (
        <div className="modal-overlay">
          <div className="modal-container">
            <header className="modal-header">
              <h2>{userToEdit ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
              <button className="close-btn" onClick={onClose} type="button"><FiX size={24} /></button>
            </header>
            <form onSubmit={handleSubmit} className="modal-form">
               {/* ... seus inputs ... */}
               <div className="form-row"><label>Nome Completo *</label><input name="nome" value={formData.nome} onChange={handleChange} required /></div>
               <div className="form-grid">
                 <div className="form-row"><label>Matrícula (RA) *</label><input name="ra" value={formData.ra} onChange={handleChange} required /></div>
                 <div className="form-row"><label>Squad *</label><select name="squad" value={formData.squad} onChange={handleChange} required><option value="" disabled>Selecione...</option>{AVAILABLE_SQUADS.map(sq => (<option key={sq} value={sq}>{sq}</option>))}</select></div>
               </div>
               <div className="form-row"><label>Email Corporativo *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
               <div className="form-row"><label>Email Pessoal</label><input type="email" name="emailPessoal" value={formData.emailPessoal} onChange={handleChange} /></div>
               <div className="form-grid">
                 <div className="form-row"><label>Senha {!userToEdit && "*"}</label><input type="password" name="senha" value={formData.senha} onChange={handleChange} required={!userToEdit} /></div>
                 <div className="form-row"><label>Confirmar Senha {!userToEdit && "*"}</label><input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required={!userToEdit} /></div>
               </div>
              <footer className="modal-footer">
                <button type="button" className="btn-secondary" onClick={onClose}>Sair</button>
                <button type="submit" className="add-btn"><FiCheck size={16} /> Salvar</button>
              </footer>
            </form>
          </div>
        </div>
      );
};

// =========================================
// NOVO COMPONENTE: Modal de Detalhes (Frequência/Recado/Feedback)
// =========================================
interface UserDetailsModalProps {
    user: Usuario;
    onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState<"frequencia" | "recado" | "feedback">("frequencia");
    const [recado, setRecado] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleSendRecado = () => {
        alert(`Recado enviado para ${user.nome}:\n"${recado}"`);
        setRecado("");
    };

    const handleSaveFeedback = () => {
        alert(`Feedback registrado para ${user.nome}:\n"${feedback}"`);
        setFeedback("");
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container details-modal">
                <header className="modal-header">
                    <h2>{user.nome} <small>({user.squad})</small></h2>
                    <button className="close-btn" onClick={onClose} type="button"><FiX size={24} /></button>
                </header>

                <div className="modal-tabs">
                    <button className={`tab-btn ${activeTab === 'frequencia' ? 'active' : ''}`} onClick={() => setActiveTab('frequencia')}>
                        <FiCalendar /> Frequência
                    </button>
                    <button className={`tab-btn ${activeTab === 'recado' ? 'active' : ''}`} onClick={() => setActiveTab('recado')}>
                        <FiMessageSquare /> Recado
                    </button>
                    <button className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                        <FiStar /> Feedback
                    </button>
                </div>

                <div className="modal-content-body">
                    {activeTab === 'frequencia' && (
                        <div className="tab-content">
                            <h3>Histórico Recente</h3>
                            <p className="placeholder-text">Visualização rápida dos últimos pontos do estagiário.</p>
                            {/* Aqui você pode futuramente renderizar uma mini-tabela ou lista de pontos */}
                            <ul className="mini-freq-list">
                                <li><span>08/11/2025</span> <span className="badge-ok">Presente (8h)</span></li>
                                <li><span>07/11/2025</span> <span className="badge-ok">Presente (8h)</span></li>
                                <li><span>06/11/2025</span> <span className="badge-warn">Atraso (7h30)</span></li>
                            </ul>
                            <button className="btn-link">Ver histórico completo</button>
                        </div>
                    )}

                    {activeTab === 'recado' && (
                        <div className="tab-content">
                            <h3>Enviar Recado</h3>
                            <p className="placeholder-text">Envie uma mensagem direta para o painel do estagiário.</p>
                            <textarea 
                                className="modal-textarea" 
                                placeholder="Digite seu recado aqui..."
                                value={recado}
                                onChange={e => setRecado(e.target.value)}
                            />
                            <button className="add-btn" onClick={handleSendRecado} disabled={!recado.trim()}>
                                Enviar Recado
                            </button>
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="tab-content">
                            <h3>Registrar Feedback</h3>
                            <p className="placeholder-text">Registre um feedback privado sobre o desempenho.</p>
                            <textarea 
                                className="modal-textarea" 
                                placeholder="Pontos positivos, pontos a melhorar..."
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                            />
                            <button className="add-btn" onClick={handleSaveFeedback} disabled={!feedback.trim()}>
                                Salvar Feedback
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// =========================================
// COMPONENTE PRINCIPAL
// =========================================
const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [busca, setBusca] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  // Novos estados para o modal de detalhes
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [userForDetails, setUserForDetails] = useState<Usuario | null>(null);

  const toggleStatus = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "ATIVO" ? "INATIVO" : "ATIVO" } : u
      )
    );
  };

  const handleCreateNew = () => { setUserToEdit(null); setIsModalOpen(true); };
  const handleEditUser = (user: Usuario) => { setUserToEdit(user); setIsModalOpen(true); };
  
  // Nova função para abrir detalhes
  const handleOpenDetails = (user: Usuario) => {
      setUserForDetails(user);
      setIsDetailsOpen(true);
  };

  const handleSaveUser = (savedUser: Usuario) => {
    setUsuarios(prev => {
      const exists = prev.some(u => u.id === savedUser.id);
      if (exists) { return prev.map(u => u.id === savedUser.id ? savedUser : u); }
      return [...prev, savedUser];
    });
    setIsModalOpen(false); setUserToEdit(null);
  };

  const usuariosFiltrados = useMemo(() => {
      const t = busca.toLowerCase();
      return usuarios.filter(u => 
        u.nome.toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || u.ra.includes(t)
      );
  }, [usuarios, busca]);

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Usuários</h1>
        <div className="header-actions">
          <button className="report-btn"><FiDownload size={16} /> Gerar relatório</button>
          <button className="add-btn" onClick={handleCreateNew}><FiPlus size={16} /> Cadastrar usuário</button>
        </div>
      </header>

      <div className="search-box">
        <input type="text" placeholder="Pesquise por nome, email ou RA..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>Status</th><th>Nome</th><th>Email</th><th>RA</th><th>Squad</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td className={`status ${u.status.toLowerCase()}`}>{u.status}</td>
                <td>{u.nome}</td><td>{u.email}</td><td>{u.ra}</td><td>{u.squad}</td>
                <td className="acoes">
                  {/* Novo Botão de Detalhes */}
                  <button className="icon-btn details" onClick={() => handleOpenDetails(u)} title="Ver Detalhes/Frequência">
                    <FiCalendar />
                  </button>
                  <button className="icon-btn edit" onClick={() => handleEditUser(u)} title="Editar Usuário">
                    <FiEdit />
                  </button>
                  <button className={`icon-btn toggle ${u.status.toLowerCase()}`} onClick={() => toggleStatus(u.id)} title={u.status === 'ATIVO' ? 'Desativar' : 'Ativar'}>
                    <FiPower />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <UserModal userToEdit={userToEdit} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />}
      {/* Renderiza o novo Modal de Detalhes */}
      {isDetailsOpen && userForDetails && <UserDetailsModal user={userForDetails} onClose={() => setIsDetailsOpen(false)} />}
    </div>
  );
};

export default Usuarios;