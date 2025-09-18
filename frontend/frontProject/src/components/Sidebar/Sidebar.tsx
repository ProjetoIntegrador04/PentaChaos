import React from 'react';
import { Home, Users, Shield, TrendingUp, Settings } from 'lucide-react';
import './Sidebar.css';
import logo from '../../assets/images/image.png'

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Menu', active: false },
    { icon: Users, label: 'Usuarios', active: false },
    { icon: Shield, label: 'Squads', active: true },
    { icon: TrendingUp, label: 'Ranking', active: false },
    { icon: Settings, label: 'Configuracoes', active: false },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Company Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;