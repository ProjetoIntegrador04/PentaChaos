import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Shield, LogOut, Settings, ChevronDown, BarChart2, List } from 'lucide-react';
import './Sidebar.css';
import logo from '../../assets/images/image.png';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems = [
    { icon: Home, label: 'Menu', path: '/dashboard' },
    { 
      icon: Users, 
      label: 'Usuarios',
      subItems: [
        { icon: List, label: 'Listagem', path: '/usuarios' },
        { icon: BarChart2, label: 'Frequência', path: '/frequencia' }
      ]
    },
    { icon: Shield, label: 'Squads', path: '/squads' },
    { icon: Settings, label: 'Configuracoes', path: '/settings' },
    { icon: LogOut, label: 'Sair', path: '/' },
  ];

  // Efeito para abrir o menu correto ao carregar a página
  useEffect(() => {
    const parentMenu = menuItems.find(item => 
      item.subItems?.some(sub => sub.path === location.pathname)
    );
    if (parentMenu) {
      setOpenMenu(parentMenu.label);
    }
  }, [location.pathname]); // Executa quando a rota muda

  const handleMenuClick = (label: string) => {
    setOpenMenu(currentOpenMenu => (currentOpenMenu === label ? null : label));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Company Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          item.subItems ? (
            <div key={index} className="nav-item-container">
              <div
                className={`nav-item has-submenu ${openMenu === item.label ? 'open' : ''} ${item.subItems.some(sub => location.pathname === sub.path) ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.label)}
              >
                <div className="nav-item-content">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                <ChevronDown size={16} className="chevron-icon" />
              </div>
              <div className={`submenu ${openMenu === item.label ? 'open' : ''}`}>
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  >
                    {subItem.icon && <subItem.icon size={16} />}
                    <span>{subItem.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={index}
              to={item.path!}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;