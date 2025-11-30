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
  senha?: string;
  nome?: string;
  emailPessoal?: string;
}

// =========================================
// COMPONENTE: Modal de Cadastro/Edição
// =========================================
interface UserModalProps {
  userToEdit?: Usuario | null;
  availableSquads: string[];
  onClose: () => void;
  onSave: (user: Usuario) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  userToEdit,
  availableSquads,
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

    if (!userToEdit && formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!formData.nome || !formData.ra || !formData.email || !formData.squad) {
      alert("Preencha todos os campos obrigatórios.");
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
      senha: formData.senha,
      emailPessoal: formData.emailPessoal,
    };

    onSave(userToSave);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>{userToEdit ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
          <button className="close-btn" onClick={onClose}>
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
              <label>RA *</label>
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
                <option value="" disabled>Selecione...</option>

                {availableSquads.length > 0 ? (
                  availableSquads.map((sq) => (
                    <option key={sq} value={sq}>{sq}</option>
                  ))
                ) : (
                  <option disabled>Nenhuma squad cadastrada</option>
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>Email Corporativo *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="add-btn">
              <FiCheck /> Salvar
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
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const availableSquads = useMemo(() => {
    const set = new Set<string>();
    usuarios.forEach((u) => {
      if (u.squad && u.squad.trim() !== "") set.add(u.squad.trim());
    });
    return Array.from(set);
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const search = busca.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.ra.toLowerCase().includes(search)
    );
  }, [usuarios, busca]);

  const handleSaveUser = async (savedUser: Usuario) => {
    try {
      const payload = {
        username: savedUser.username,
        email: savedUser.email,
        password: savedUser.senha || "123456",
        ra: savedUser.ra,
        squad: savedUser.squad,
      };

      if (userToEdit) {
        await api.put(`/users/${savedUser.id}`, payload);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === savedUser.id ? { ...u, ...savedUser } : u))
        );
      } else {
        const res = await api.post("/users/create-intern", payload);
        setUsuarios((prev) => [res.data, ...prev]);
      }

      alert("Usuário salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert("Erro ao cadastrar/editar o usuário.");
    } finally {
      setIsModalOpen(false);
      setUserToEdit(null);
    }
  };

  // ========= GERAR RELATÓRIO (CSV) =========
  const handleGenerateReport = () => {
    if (usuariosFiltrados.length === 0) {
      alert("Não há usuários para gerar relatório.");
      return;
    }

    const header = ["Nome", "Email", "RA", "Squad", "Status", "Roles"];
    const rows: string[][] = usuariosFiltrados.map((u) => [
      u.username,
      u.email,
      u.ra,
      u.squad,
      u.enabled ? "ATIVO" : "INATIVO",
      u.roles.join(" | "),
    ]);

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
    link.setAttribute("download", `relatorio_usuarios_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="usuarios-page">

      <header className="usuarios-header">
        <h1>Controle de Usuários</h1>
        <div className="header-actions">
          <button className="report-btn" onClick={handleGenerateReport}>
            <FiDownload /> Relatório
          </button>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Cadastrar usuário
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
                    onClick={() => {
                      setUserToEdit(u);
                      setIsModalOpen(true);
                    }}
                  >
                    <FiEdit />
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
          availableSquads={availableSquads}
          onClose={() => {
            setIsModalOpen(false);
            setUserToEdit(null);
          }}
          onSave={handleSaveUser}
        />
      )}

    </div>
  );
};

export default Usuarios;
