import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Clock,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import logo from "../../assets/images/image.png";
import "./Sidebar.css";

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

  const menuItems: MenuItem[] = useMemo(() => [
    { icon: Home,          label: "Início",            path: "/intern/home" },
    // 🔹 CORREÇÃO AQUI: path atualizado para '/intern/task' (singular) para bater com o App.tsx
    { icon: ClipboardList, label: "Minhas atividades", path: "/intern/task" },
    {
      icon: Clock,
      label: "Ponto",
      subItems: [
        { icon: Clock,         label: "Incluir Ponto",       path: "/intern/ponto" },
        { icon: CalendarCheck, label: "Frequência",  path: "/intern/frequencia" },
      ],
    },
    { icon: Settings, label: "Configurações",      path: "/intern/settings" },
    { icon: LogOut,   label: "Sair" }, 
  ], []);

  // ... (resto do componente igual)
  useEffect(() => {
    const parent = menuItems.find((item) =>
      item.subItems?.some((sub) => sub.path === location.pathname)
    );
    if (parent) setOpenMenu(parent.label);
  }, [location.pathname, menuItems]);

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
                      <a
                        key={i}
                        href={sub.path}
                        className={`submenu-item ${location.pathname === sub.path ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = sub.path;
                        }}
                      >
                        {SubIcon && <SubIcon size={16} />}
                        <span>{sub.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.path!}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = item.path!;
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarIntern;