import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; // Ajuste o caminho se necessário
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// A linha mais importante é esta:
export default MainLayout;