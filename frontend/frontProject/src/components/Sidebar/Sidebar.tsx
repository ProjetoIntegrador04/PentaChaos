import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Shield, LogOut, Settings } from 'lucide-react';
import './Sidebar.css';
import logo from '../../assets/images/image.png';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Menu', path: '/dashboard' },
    { icon: Users, label: 'Usuarios', path: '/usuarios' },
    { icon: Shield, label: 'Squads', path: '/squads' },
    { icon: Settings, label: 'Configuracoes', path: '/configuracoes' },
    { icon: LogOut, label: 'Sair', path: '/' },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <img src={logo} alt="Company Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
