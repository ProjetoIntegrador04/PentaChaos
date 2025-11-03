// src/components/Sidebar/SidebarIntern.tsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Clock,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/image.png";
import "./Sidebar.css";
import "./SidebarIntern.css"

type MenuItem = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  path?: string;
  subItems?: Array<{ icon?: React.ComponentType<{ size?: number }>; label: string; path: string }>;
};

const SidebarIntern: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Itens do ESTAGIÁRIO — ajuste os paths conforme suas rotas reais
  const menuItems: MenuItem[] = [
    { icon: Home,          label: "Início",            path: "/intern/home" },
    { icon: ClipboardList, label: "Minhas atividades", path: "/intern/atividades" },
    {
      icon: Clock,
      label: "Ponto",
      subItems: [
        { icon: Clock,         label: "Incluir Ponto",       path: "/intern/ponto" },
        { icon: CalendarCheck, label: "Frequência",  path: "/intern/frequencia" },
      ],
    },
    { icon: Settings, label: "Configurações",      path: "/intern/settings" },
    { icon: LogOut,   label: "Sair" }, // ação
  ];

  // Abre automaticamente a gaveta se alguma subrota estiver ativa
  useEffect(() => {
    const parent = menuItems.find((item) =>
      item.subItems?.some((sub) => sub.path === location.pathname)
    );
    if (parent) setOpenMenu(parent.label);
  }, [location.pathname]);

  const handleMenuClick = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
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
          // Botão de sair
          if (item.label === "Sair") {
            const Icon = item.icon;
            return (
              <button
                key={index}
                type="button"
                className="nav-item"
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", textAlign: "left" }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          }

          // Item com subItens (gaveta)
          if (item.subItems && item.subItems.length > 0) {
            const Icon = item.icon;
            const hasActiveSub = item.subItems.some((sub) => sub.path === location.pathname);
            return (
              <div key={index} className="nav-item-container">
                <div
                  className={`nav-item has-submenu ${openMenu === item.label ? "open" : ""} ${
                    hasActiveSub ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick(item.label)}
                >
                  <div className="nav-item-content">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown size={16} className="chevron-icon" />
                </div>
                <div className={`submenu ${openMenu === item.label ? "open" : ""}`}>
                  {item.subItems.map((sub, i) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={i}
                        to={sub.path}
                        className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}
                      >
                        {SubIcon && <SubIcon size={16} />}
                        <span>{sub.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Item simples
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path!}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarIntern;
