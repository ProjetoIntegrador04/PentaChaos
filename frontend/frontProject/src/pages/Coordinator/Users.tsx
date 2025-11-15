import React, { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiPower,
  FiDownload,
  FiX,
  FiCheck,
  FiTrash,
} from "react-icons/fi";
import "../../styles/Coordinator/Users.css";
import api from "../../api/https";

// =========================================
// TIPOS
// =========================================
interface Usuario {
  id: number;
  username: string;
  email: string;
  ra: string;
  squad: string;
  enabled: boolean;
  roles: string[];
  senha?: string; // usado apenas no cadastro/edição
  nome?: string; // compatibilidade com modal
  emailPessoal?: string;
}

// =========================================
// CONSTANTES
// =========================================
const AVAILABLE_SQUADS = ["CASE", "LSD", "INFRA", "PENTA", "DEVOPS", "404"];

// =========================================
// COMPONENTE: Modal de Cadastro/Edição
// =========================================
interface UserModalProps {
  userToEdit?: Usuario | null;
  onClose: () => void;
  onSave: (user: Usuario) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  userToEdit,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nome: userToEdit?.username || "",
    ra: userToEdit?.ra || "",
    email: userToEdit?.email || "",
    emailPessoal: userToEdit?.emailPessoal || "",
    squad: userToEdit?.squad || "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!formData.nome || !formData.email || !formData.ra || !formData.squad) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const userToSave: Usuario = {
      id: userToEdit?.id || Date.now(),
      username: formData.nome,
      email: formData.email,
      ra: formData.ra,
      squad: formData.squad,
      enabled: userToEdit?.enabled ?? true,
      roles: userToEdit?.roles ?? ["ROLE_INTERN"],
      senha: formData.senha, // se vazio, tratamos no front antes de mandar pro back
      emailPessoal: formData.emailPessoal,
    };

    onSave(userToSave);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>{userToEdit ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
          <button className="close-btn" onClick={onClose} type="button">
            <FiX size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Nome Completo *</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Matrícula (RA) *</label>
              <input
                name="ra"
                value={formData.ra}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Squad *</label>
              <select
                name="squad"
                value={formData.squad}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {AVAILABLE_SQUADS.map((sq) => (
                  <option key={sq} value={sq}>
                    {sq}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Email Corporativo *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Email Pessoal</label>
            <input
              type="email"
              name="emailPessoal"
              value={formData.emailPessoal}
              onChange={handleChange}
            />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Senha {!userToEdit && "*"}</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required={!userToEdit}
              />
            </div>
            <div className="form-row">
              <label>Confirmar Senha {!userToEdit && "*"}</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required={!userToEdit}
              />
            </div>
          </div>
          <footer className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Sair
            </button>
            <button type="submit" className="add-btn">
              <FiCheck size={16} /> Salvar
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
const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // BUSCAR USUÁRIOS DA API
  // =========================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsuarios(res.data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        alert("Erro ao carregar lista de usuários.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // =========================================
  // CRIAR / EDITAR USUÁRIO
  // =========================================
  const handleSaveUser = async (savedUser: Usuario, isEdit: boolean) => {
    try {
      if (isEdit) {
        // edição
        const payload: any = {
          username: savedUser.username,
          email: savedUser.email,
          ra: savedUser.ra,
          squad: savedUser.squad,
          emailPessoal: savedUser.emailPessoal,
        };

        // Só manda senha se o usuário informou uma nova
        if (savedUser.senha && savedUser.senha.trim() !== "") {
          payload.password = savedUser.senha;
        }

        const res = await api.put(`/users/${savedUser.id}`, payload);

        setUsuarios((prev) =>
          prev.map((u) => (u.id === savedUser.id ? { ...u, ...res.data } : u))
        );

        alert("Usuário atualizado com sucesso!");
      } else {
        // criação
        const payload = {
          username: savedUser.username,
          email: savedUser.email,
          password: savedUser.senha || "123456",
          ra: savedUser.ra,
          squad: savedUser.squad,
          emailPessoal: savedUser.emailPessoal,
        };

        const res = await api.post("/users/create-intern", payload);
        setUsuarios((prev) => [res.data, ...prev]);
        alert("Usuário criado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert("Erro ao salvar o usuário.");
    } finally {
      setIsModalOpen(false);
      setUserToEdit(null);
    }
  };

  const handleCreateNew = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: Usuario) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  // =========================================
  // ALTERAR STATUS (ATIVO / INATIVO)
  // =========================================
  const handleToggleStatus = async (user: Usuario) => {
    try {
      const novoStatus = !user.enabled;
      const res = await api.patch(`/users/${user.id}/status`, {
        enabled: novoStatus,
      });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, enabled: res.data.enabled } : u
        )
      );
    } catch (err) {
      console.error("Erro ao alterar status do usuário:", err);
      alert("Erro ao alterar status do usuário.");
    }
  };

  // =========================================
  // EXCLUIR USUÁRIO
  // =========================================
  const handleDeleteUser = async (user: Usuario) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o usuário "${user.username}"?`
    );
    if (!confirmar) return;

    try {
      await api.delete(`/users/${user.id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== user.id));
      alert("Usuário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir o usuário.");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const t = busca.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
        u.ra.toLowerCase().includes(t)
    );
  }, [usuarios, busca]);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Usuários</h1>
        <div className="header-actions">
          <button className="report-btn">
            <FiDownload size={16} /> Gerar relatório
          </button>
          <button className="add-btn" onClick={handleCreateNew}>
            <FiPlus size={16} /> Cadastrar usuário
          </button>
        </div>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquise por nome, email ou RA..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Nome</th>
              <th>Email</th>
              <th>RA</th>
              <th>Squad</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td className={`status ${u.enabled ? "ativo" : "inativo"}`}>
                  {u.enabled ? "ATIVO" : "INATIVO"}
                </td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.ra}</td>
                <td>{u.squad}</td>
                <td className="acoes">
                  <button
                    className="icon-btn edit"
                    onClick={() => handleEditUser(u)}
                    title="Editar Usuário"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="icon-btn status"
                    onClick={() => handleToggleStatus(u)}
                    title={u.enabled ? "Inativar" : "Ativar"}
                  >
                    <FiPower />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDeleteUser(u)}
                    title="Excluir Usuário"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UserModal
          userToEdit={userToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setUserToEdit(null);
          }}
          onSave={(user) => handleSaveUser(user, !!userToEdit)}
        />
      )}
    </div>
  );
};

export default Usuarios;
