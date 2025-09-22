import React from 'react';
import SquadCards from '../components/Dashboard/SquadCards';
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <div className="notification-icon"></div>
          <div className="user-avatar"></div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <SquadCards />
        
      </div>
    </div>
  );
};

export default Dashboard;