import React from "react";
import { Outlet } from "react-router-dom";
import SidebarIntern from "../Sidebar/SidebarInten";
import Topbar from '../Topbar/Topbar';
import './MainLayoutIntern.css'; 

const MainLayoutIntern: React.FC = () => {
  return (
    <div className="intern-layout"> 
      <SidebarIntern />
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