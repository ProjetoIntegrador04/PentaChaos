// src/components/Layout/MainLayoutIntern.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarIntern from "../Sidebar/SidebarInten"; // 1. Corrigido o nome do import
import Topbar from '../Topbar/Topbar';   // 2. Importe o Topbar
import './MainLayoutIntern.css'; 

const MainLayoutIntern: React.FC = () => {
  return (
    <div className="intern-layout"> 
      <SidebarIntern />
      {/* 3. Adicionada a estrutura de wrapper + main */}
      <div className="intern-content-wrapper"> 
        <Topbar />
        <main className="intern-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayoutIntern;