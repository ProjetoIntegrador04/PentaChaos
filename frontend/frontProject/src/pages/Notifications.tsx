import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from 'react-icons/fi';
import notificationService, { Notification } from '../../services/notificationService';
import '../../styles/Coordinator/Notifications.css';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getAllNotifications();
    setNotifications(allNotifications);
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
      loadNotifications();
    }

    if (notification.actionRoute) {
      navigate(notification.actionRoute);
    }
  };

  const handleMarkAsRead = (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    notificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const handleRemove = (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    notificationService.removeNotification(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
  };

  const handleClearRead = () => {
    if (window.confirm('Deseja remover todas as notificações lidas?')) {
      notificationService.clearReadNotifications();
      loadNotifications();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Deseja remover TODAS as notificações?')) {
      notificationService.clearAllNotifications();
      loadNotifications();
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="notification-icon success" />;
      case 'warning':
        return <FiAlertCircle className="notification-icon warning" />;
      case 'error':
        return <FiAlertCircle className="notification-icon error" />;
      default:
        return <FiInfo className="notification-icon info" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div className="header-left">
          <FiBell size={28} />
          <h1>Notificações</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>

        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn-action" onClick={handleMarkAllAsRead}>
              <FiCheck size={16} />
              Marcar todas como lidas
            </button>
          )}
          {notifications.length > 0 && (
            <>
              <button className="btn-action" onClick={handleClearRead}>
                <FiTrash2 size={16} />
                Limpar lidas
              </button>
              <button className="btn-action danger" onClick={handleClearAll}>
                <FiTrash2 size={16} />
                Limpar todas
              </button>
            </>
          )}
        </div>
      </header>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Não lidas ({unreadCount})
        </button>
      </div>

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <FiBell size={80} className="empty-icon" />
            <h2>Nenhuma notificação</h2>
            <p>
              {filter === 'unread'
                ? 'Você está em dia! Não há notificações não lidas.'
                : 'Você não tem notificações no momento.'}
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? 'read' : 'unread'
                } ${notification.type}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-header-content">
                    <h3>{notification.title}</h3>
                    <span className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="action-btn mark-read"
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                      title="Marcar como lida"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button
                    className="action-btn remove"
                    onClick={(e) => handleRemove(e, notification.id)}
                    title="Remover"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
