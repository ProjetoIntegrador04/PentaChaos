import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Shield, LogOut, Settings, ChevronDown, BarChart2, List, ClipboardList, CheckCircle } from 'lucide-react'; 
import { useAuth } from '../../context/useAuth';
import './Sidebar.css';
import logo from '../../assets/images/image.png';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = useMemo(() => [
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
    
    // ==========================================================
    // 🔹 AQUI ESTÁ O PONTO DE FALHA! 🔹
    // 
    // Garanta que o seu código tenha esta linha exatamente assim:
    { icon: ClipboardList, label: 'Tarefas', path: '/task' }, 
    //
    // Você provavelmente tem "/intern/ponto" aqui por engano.
    // ==========================================================
    
    { icon: CheckCircle, label: 'Solicitações de Ajuste', path: '/adjustment-requests' },
    { icon: Settings, label: 'Configuracoes', path: '/settings' },
    { icon: LogOut, label: 'Sair' }, // Sem path, usa o handleLogout
  ], []);

  // ... (o resto do seu componente useEffect, handleMenuClick, etc. está CORRETO) ...
  // ... (a lógica de renderização com handleLogout está CORRETA) ...

  useEffect(() => {
    const parentMenu = menuItems.find(item => 
      item.subItems?.some(sub => sub.path === location.pathname)
    );
    if (parentMenu) {
      setOpenMenu(parentMenu.label);
    }
  }, [location.pathname, menuItems]); 

  const handleMenuClick = (label: string) => {
    setOpenMenu(currentOpenMenu => (currentOpenMenu === label ? null : label));
  };

  const handleLogout = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Company Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.label === 'Sair') {
            return (
              <button
                key={index}
                type="button"
                className="nav-item"
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", textAlign: "left" }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          }
          
          if (item.subItems) {
            return (
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
                    <a
                      key={subIndex}
                      href={subItem.path}
                      className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = subItem.path;
                      }}
                    >
                      {subItem.icon && <subItem.icon size={16} />}
                      <span>{subItem.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <a
              key={index}
              href={item.path!}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = item.path!;
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;