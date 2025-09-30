import React from "react";
import { FiBell, FiUser } from "react-icons/fi"; // ← ícones
import SquadCards from "../../components/Dashboard/SquadCards";
import FrequencyChart from "../../components/Dashboard/FrequencyChart";
import TeamMembers from "../../components/Dashboard/TeamMembers";
import "../../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const notificationCount = 3; // 🔹 mock: número de notificações

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>

        <div className="header-actions">
          {/* 🔔 Notificações */}
          <button className="icon-btn notification-icon" aria-label="Notificações">
            <FiBell size={20} />
            {notificationCount > 0 && (
              <span className="badge">{notificationCount}</span>
            )}
          </button>

          {/* 👤 Usuário */}
          <div className="icon-btn user-avatar" aria-label="Usuário">
            <FiUser size={20} />
          </div>
        </div>
      </header>

      {/* Carrossel de Squads */}
      <section className="panel panel-squads" aria-label="Squads">
        <SquadCards />
      </section>

      {/* Linha inferior: Integrantes (esq) + Frequência (dir) */}
      <section className="bottom-grid" aria-label="Integrantes e Frequência">
        <div className="panel panel-members">
          <TeamMembers />
          <div className="panel-footer"></div>
        </div>

        <div className="panel panel-frequency">
          <FrequencyChart />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
