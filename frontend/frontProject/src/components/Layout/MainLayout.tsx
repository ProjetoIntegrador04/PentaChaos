import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; 
import { FiBell, FiUser } from 'react-icons/fi';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const notificationCount = 3; // mock

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-wrapper">

        <main className="main-content">
          <div className="page-header-actions">
            <button className="icon-btn notification-icon" aria-label="Notificações">
              <FiBell size={20} />
              {notificationCount > 0 && (
                <span className="badge">{notificationCount}</span>
              )}
            </button>
            <div className="icon-btn user-avatar" aria-label="Usuário">
              <FiUser size={20} />
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;