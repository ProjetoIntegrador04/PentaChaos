// src/components/Topbar/Topbar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import notificationService from '../../services/notificationService';
import './Topbar.css';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Subscreve para receber atualizações do contador
    const unsubscribe = notificationService.subscribe(setNotificationCount);
    
    // Limpa a subscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <header className="topbar">
      {/* Botão de Notificações (Sino) */}
      <button 
        className="topbar-icon-btn" 
        aria-label="Notificações"
        onClick={handleNotificationClick}
        title={`${notificationCount} notificações não lidas`}
      >
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount}</span>
        )}
      </button>
    </header>
  );
};

export default Topbar;