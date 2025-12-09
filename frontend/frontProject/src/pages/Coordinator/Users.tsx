import React, { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiDownload,
  FiX,
  FiCheck,
} from "react-icons/fi";
import "../../styles/Coordinator/Users.css";
import api from "../../api/https";

interface Role {
  id: number;
  name: string;
}

interface Usuario {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  ra?: string;
  squad?: string;
  phoneNumber?: string;
  enabled: boolean;
  roles: Role[];
}

interface UserFormData {
  username: string;
  fullName: string;
  ra: string;
  email: string;
  phoneNumber: string;
  squad: string;
  password: string;
  confirmPassword: string;
}

interface UserModalProps {
  userToEdit?: Usuario | null;
  availableSquads: string[];
  onClose: () => void;
  onSave: (formData: UserFormData) => void;
}

const UserModal: React.FC<UserModalProps> = ({ userToEdit, availableSquads, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: userToEdit?.username || "",
    fullName: userToEdit?.fullName || "",
    ra: userToEdit?.ra || "",
    email: userToEdit?.email || "",
    phoneNumber: userToEdit?.phoneNumber || "",
    squad: userToEdit?.squad || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit && formData.password !== formData.confirmPassword) {
      alert("As senhas n�o coincidem!");
      return;
    }
    if (!formData.username || !formData.email) {
      alert("Preencha os campos obrigat�rios (username e email).");
      return;
    }
    if (!userToEdit && !formData.password) {
      alert("A senha � obrigat�ria para novos usu�rios.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>{userToEdit ? "Editar Usu�rio" : "Cadastrar Usu�rio"}</h2>
          <button className="close-btn" onClick={onClose}><FiX size={24} /></button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Username *</label>
            <input name="username" value={formData.username} onChange={handleChange} required placeholder="Nome de usu�rio para login" />
          </div>
          <div className="form-row">
            <label>Nome Completo</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nome completo do usu�rio" />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>RA</label>
              <input name="ra" value={formData.ra} onChange={handleChange} placeholder="Registro Acad�mico" />
            </div>
            <div className="form-row">
              <label>Squad</label>
              <select name="squad" value={formData.squad} onChange={handleChange}>
                <option value="">Selecione...</option>
                {availableSquads.length > 0 ? availableSquads.map((sq) => (<option key={sq} value={sq}>{sq}</option>)) : (<option disabled>Nenhuma squad cadastrada</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Email *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" />
          </div>
          <div className="form-row">
            <label>Telefone</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="(00) 00000-0000" />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Senha {!userToEdit && "*"}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required={!userToEdit} placeholder="M�nimo 6 caracteres" />
            </div>
            <div className="form-row">
              <label>Confirmar Senha {!userToEdit && "*"}</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!userToEdit} placeholder="Repita a senha" />
            </div>
          </div>
          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="add-btn"><FiCheck /> Salvar</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log(" Loading users from backend...");
        const res = await api.get("/api/v1/users");
        console.log(" Users loaded:", res.data);
        setUsuarios(res.data);
      } catch (err) {
        console.error(" Error loading users:", err);
        alert("Erro ao carregar lista de usu�rios.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const availableSquads = useMemo(() => {
    const set = new Set<string>();
    usuarios.forEach((u) => {if (u.squad && u.squad.trim() !== "") set.add(u.squad.trim());});
    return Array.from(set);
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const search = busca.toLowerCase();
    return usuarios.filter((u) =>
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      (u.ra && u.ra.toLowerCase().includes(search)) ||
      (u.fullName && u.fullName.toLowerCase().includes(search))
    );
  }, [usuarios, busca]);

  const handleSaveUser = async (formData: UserFormData) => {
    try {
      console.log("💾 Saving user:", formData);
      if (userToEdit) {
        const payload = {username: formData.username, fullName: formData.fullName, email: formData.email, ra: formData.ra, squad: formData.squad, phoneNumber: formData.phoneNumber, enabled: userToEdit.enabled};
        console.log(" PUT /api/v1/users/" + userToEdit.id, payload);
        const res = await api.put(`/api/v1/users/${userToEdit.id}`, payload);
        console.log(" User updated:", res.data);
        setUsuarios((prev) => prev.map((u) => (u.id === userToEdit.id ? res.data : u)));
        alert("Usu�rio atualizado com sucesso!");
      } else {
        const payload = {username: formData.username, fullName: formData.fullName, email: formData.email, password: formData.password, ra: formData.ra, squad: formData.squad, phoneNumber: formData.phoneNumber, isAdmin: false};
        console.log(" POST /auth/register", payload);
        const res = await api.post("/auth/register", payload);
        console.log(" User created:", res.data);
        setUsuarios((prev) => [res.data.user, ...prev]);
        alert("Usu�rio cadastrado com sucesso!");
      }
    } catch (err) {
      console.error("❌ Error saving user:", err);
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erro ao cadastrar/editar o usuário.";
      alert(errorMessage);
    } finally {
      setIsModalOpen(false);
      setUserToEdit(null);
    }
  };

  const handleGenerateReport = () => {
    if (usuariosFiltrados.length === 0) {
      alert("N�o h� usu�rios para gerar relat�rio.");
      return;
    }
    const header = ["ID", "Username", "Nome Completo", "Email", "RA", "Squad", "Telefone", "Status", "Roles"];
    const rows: string[][] = usuariosFiltrados.map((u) => [String(u.id), u.username, u.fullName || "", u.email, u.ra || "", u.squad || "", u.phoneNumber || "", u.enabled ? "ATIVO" : "INATIVO", u.roles.map(r => r.name).join(" | ")]);
    const escape = (value: string) => {const v = value ?? ""; if (v.includes(";") || v.includes('"') || v.includes("\n")) {return `"${v.replace(/"/g, '""')}"`;}return v;};
    const csvContent = [header, ...rows].map((row) => row.map(escape).join(";")).join("\n");
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `relatorio_usuarios_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (<div className="usuarios-page"><div style={{ padding: "2rem", textAlign: "center" }}><p>Carregando usu�rios...</p></div></div>);
  }

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Usu�rios</h1>
        <div className="header-actions">
          <button className="report-btn" onClick={handleGenerateReport}><FiDownload /> Relat�rio</button>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}><FiPlus /> Cadastrar usu�rio</button>
        </div>
      </header>
      <div className="search-box">
        <input type="text" placeholder="Pesquise por nome, username, email ou RA..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>
      <div className="usuarios-table">
        <table>
          <thead>
            <tr><th>Status</th><th>Username</th><th>Nome Completo</th><th>Email</th><th>RA</th><th>Squad</th><th>A��es</th></tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (<tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>Nenhum usu�rio encontrado.</td></tr>) : (usuariosFiltrados.map((u) => (<tr key={u.id}><td className={`status ${u.enabled ? "ativo" : "inativo"}`}>{u.enabled ? "ATIVO" : "INATIVO"}</td><td>{u.username}</td><td>{u.fullName || "-"}</td><td>{u.email}</td><td>{u.ra || "-"}</td><td>{u.squad || "-"}</td><td className="acoes"><button className="icon-btn edit" onClick={() => {setUserToEdit(u); setIsModalOpen(true);}} title="Editar usu�rio"><FiEdit /></button></td></tr>)))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (<UserModal userToEdit={userToEdit} availableSquads={availableSquads} onClose={() => {setIsModalOpen(false); setUserToEdit(null);}} onSave={handleSaveUser} />)}
    </div>
  );
};

export default Usuarios;
