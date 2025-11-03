// src/components/Topbar/Topbar.tsx
import React from 'react';
import { Bell, User } from 'lucide-react';
import './Topbar.css'; // Vamos criar este CSS

const Topbar: React.FC = () => {
  // Você pode pegar dados reais do seu AuthContext no futuro
  const notificationCount = 3; // Mock
  const userName = "Pablo"; // Mock

  return (
    <header className="topbar">
      {/* Botão de Notificações (Sino) */}
      <button className="topbar-icon-btn" aria-label="Notificações">
        <Bell size={20} />
        {notificationCount > 0 && <span className="notification-dot"></span>}
      </button>

      {/* Botão de Perfil (Usuário) */}
      <button className="profile-btn" aria-label="Perfil">
        <User size={20} />
      </button>
    </header>
  );
};

export default Topbar;