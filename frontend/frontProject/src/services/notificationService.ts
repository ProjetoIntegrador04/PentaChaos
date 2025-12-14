/**
 * Serviço de Notificações - Frontend
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
    // Carrega notificações do localStorage
    this.loadFromStorage();
    // Se não houver notificações, carrega dados mockados
    if (this.notifications.length === 0) {
      this.loadMockNotifications();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored) as Notification[];
        // Converte strings de data de volta para objetos Date
        this.notifications = parsed.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar notificações:', error);
      this.notifications = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('❌ Erro ao salvar notificações:', error);
    }
  }

  private loadMockNotifications(): void {
    this.notifications = [
      {
        id: '1',
        title: 'Nova Squad Criada',
        message: 'A squad "LSD Team" foi criada com sucesso!',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        icon: 'users',
        actionRoute: '/coordinator/squads',
      },
      {
        id: '2',
        title: 'Lembrete de Ponto',
        message: 'Não esqueça de registrar sua saída hoje!',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
        read: false,
        icon: 'clock',
      },
      {
        id: '3',
        title: 'Solicitação de Ajuste Aprovada',
        message: 'Sua solicitação de ajuste de ponto foi aprovada.',
        type: 'success',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        read: true,
        icon: 'check-circle',
      },
      {
        id: '4',
        title: 'Novo Membro Adicionado',
        message: 'Pedro Santos foi adicionado à sua squad.',
        type: 'info',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        read: true,
        icon: 'user-plus',
      },
    ];
    this.saveToStorage();
  }

  /**
   * Retorna todas as notificações ordenadas por data
   */
  getAllNotifications(): Notification[] {
    return [...this.notifications].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Retorna apenas notificações não lidas
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  /**
   * Retorna o contador de notificações não lidas
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Marca uma notificação como lida
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(): void {
    let changed = false;
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * Remove uma notificação
   */
  removeNotification(notificationId: string): void {
    const index = this.notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * Limpa todas as notificações lidas
   */
  clearReadNotifications(): void {
    const before = this.notifications.length;
    this.notifications = this.notifications.filter((n) => !n.read);
    if (this.notifications.length !== before) {
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * Limpa todas as notificações
   */
  clearAllNotifications(): void {
    if (this.notifications.length > 0) {
      this.notifications = [];
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * Adiciona uma nova notificação
   */
  addNotification(
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();
    
    // Notificação do navegador (se permitido)
    this.showBrowserNotification(newNotification);
  }

  /**
   * Mostra notificação do navegador
   */
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png',
          badge: '/logo.png',
        });
      } catch (error) {
        console.error('❌ Erro ao mostrar notificação do navegador:', error);
      }
    }
  }

  /**
   * Solicita permissão para notificações do navegador
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('⚠️ Navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Subscreve para receber atualizações do contador
   */
  subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    // Notifica imediatamente com o valor atual
    listener(this.getUnreadCount());

    // Retorna função para cancelar subscrição
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notifica todos os ouvintes sobre mudanças
   */
  private notifyListeners(): void {
    const count = this.getUnreadCount();
    this.listeners.forEach((listener) => listener(count));
  }
}

// Exporta instância singleton
export default new NotificationService();
