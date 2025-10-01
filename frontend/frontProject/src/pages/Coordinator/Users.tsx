import React, { useState } from "react";
import { FiPlus, FiEdit, FiPower } from "react-icons/fi"; 
import "../../styles/Coordinator/Users.css";

interface Usuario {
  id: number;
  status: "ATIVO" | "INATIVO";
  nome: string;
  email: string;
  ra: string;
  tipo: string;
}

const mockUsuarios: Usuario[] = [
  { id: 1, status: "ATIVO", nome: "David Franco", email: "david.franco@email.com", ra: "554033", tipo: "Estagiário" },
  { id: 2, status: "ATIVO", nome: "Maria Souza", email: "maria.souza@email.com", ra: "778899", tipo: "Estagiário" },
  { id: 3, status: "INATIVO", nome: "João Silva", email: "joao.silva@email.com", ra: "112233", tipo: "Estagiário    " },
  { id: 4, status: "ATIVO", nome: "Thóris Merdeiros", email: "thoris.merds@email.com", ra: "778865", tipo: "Estagiário" },
  { id: 5, status: "INATIVO", nome: "Carlos Eduardo", email: "carlos.edu@email.com", ra: "112267", tipo: "Estagiário    " },
];

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [busca, setBusca] = useState("");

  // 🔹 Alternar status (ATIVO <-> INATIVO)
  const toggleStatus = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ATIVO" ? "INATIVO" : "ATIVO" }
          : u
      )
    );
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.ra.includes(busca)
  );

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Usuários</h1>
        <button className="add-btn">
          <FiPlus size={16} /> Cadastrar usuário
        </button>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquise..."
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
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td className={`status ${u.status.toLowerCase()}`}>
                  {u.status}
                </td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.ra}</td>
                <td>{u.tipo}</td>
                <td className="acoes">
                  <button className="icon-btn edit">
                    <FiEdit />
                  </button>
                  <button
                    className={`icon-btn toggle ${u.status.toLowerCase()}`}
                    onClick={() => toggleStatus(u.id)}
                  >
                    <FiPower />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
