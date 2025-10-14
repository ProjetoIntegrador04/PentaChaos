import React, { useMemo, useState } from "react";
import { FiPlus, FiEdit, FiUsers, FiDownload } from "react-icons/fi";

import "../../styles/Coordinator/Users.css";
import "../../styles/Coordinator/Squads.css";

type Member = { id: string; name: string; role: string };
type Squad = { id: string; name: string; members: Member[] };

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

export default function Squads() {
  const [squads] = useState<Squad[]>(mockSquads);
  const [selectedId, setSelectedId] = useState<string>(mockSquads[0].id);
  const [busca, setBusca] = useState("");

  const squadsFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return q ? squads.filter((s) => s.name.toLowerCase().includes(q)) : squads;
  }, [busca, squads]);

  const selected = useMemo(() => {
    const fromFilter = squadsFiltrados.find((s) => s.id === selectedId);
    return fromFilter ?? squadsFiltrados[0] ?? null;
  }, [selectedId, squadsFiltrados]);

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Controle de Squads</h1>
        
        <div className="header-actions">
          <button className="report-btn">
            <FiDownload size={16} /> Gerar relatório
          </button>
          <button className="add-btn">
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
                  <span className="team-name">{s.name}</span>
                  <span className="team-count">
                    <FiUsers /> {s.members.length}
                  </span>
                </li>
              );
            })}
            {squadsFiltrados.length === 0 && (
              <li className="no-results">Nenhuma squad encontrada.</li>
            )}
          </ul>
        </aside>

        <section className="members-card">
          <table className="members-table">
            <thead>
              <tr>
                <th>Integrantes</th>
                <th>Função</th>
                <th className="th-edit">Editar</th>
              </tr>
            </thead>
            <tbody>
              {selected?.members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td className="role">{m.role}</td>
                  <td className="edit-cell">
                    <button className="icon-edit" aria-label="Editar">
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))}
              {selected && selected.members.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty-row">
                    Nenhum integrante nesta squad.
                  </td>
                </tr>
              )}
              {!selected && (
                <tr>
                  <td colSpan={3} className="empty-row">
                    Selecione uma squad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}