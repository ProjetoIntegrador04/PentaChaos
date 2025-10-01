import React from "react";
import SquadCards from "../../components/Dashboard/SquadCards";
import FrequencyChart from "../../components/Dashboard/FrequencyChart";
import TeamMembers from "../../components/Dashboard/TeamMembers";
import "../../styles/Coordinator/Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Carrossel*/}
      <section className="panel panel-squads" aria-label="Squads">
        <SquadCards />
      </section>

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
