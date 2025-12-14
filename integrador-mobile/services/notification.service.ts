/**
 * Serviço de Notificações
 * Gerencia notificações do sistema
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  icon?: string;
  actionRoute?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((count: number) => void)[] = [];

  constructor() {
    // Carrega notificações mockadas (em produção viria do backend)
    this.loadMockNotifications();
  }

  private loadMockNotifications() {
    this.notifications = [
      {
        id: '1',
        title: 'Nova Squad Criada',
        message: 'A squad "LSD Team" foi criada com sucesso!',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        icon: 'people',
      },
      {
        id: '2',
        title: 'Lembrete de Ponto',
        message: 'Não esqueça de registrar sua saída hoje!',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
        read: false,
        icon: 'time',
      },
      {
        id: '3',
        title: 'Novo Membro Adicionado',
        message: 'João Silva foi adicionado à sua squad.',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        read: true,
        icon: 'person-add',
      },
    ];
  }

  /**
   * Retorna todas as notificações
   */
  getAllNotifications(): Notification[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Retorna apenas notificações não lidas
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Retorna o contador de notificações não lidas
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Marca uma notificação como lida
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  /**
   * Remove uma notificação
   */
  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  /**
   * Limpa todas as notificações lidas
   */
  clearReadNotifications(): void {
    this.notifications = this.notifications.filter(n => !n.read);
    this.notifyListeners();
  }

  /**
   * Adiciona uma nova notificação
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    this.notifications.unshift(newNotification);
    this.notifyListeners();
  }

  /**
   * Subscreve para receber atualizações do contador
   */
  subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    listener(this.getUnreadCount());
    
    // Retorna função para cancelar subscrição
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const count = this.getUnreadCount();
    this.listeners.forEach(listener => listener(count));
  }
}

export default new NotificationService();
