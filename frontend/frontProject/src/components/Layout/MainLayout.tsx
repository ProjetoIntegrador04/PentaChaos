import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; // Sidebar do Coordenador
import Topbar from '../Topbar/topbar';   // 1. Importe o Topbar
import './MainLayout.css'; 

const MainLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-wrapper">
        <Topbar /> {/* 2. Adicione o Topbar aqui */}
        {/* Esta área de main-content é que terá o scroll */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;