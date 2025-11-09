export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface NotificationsAdapter {
  sendToAdmins(payload: NotificationPayload): Promise<void>;
}

class ConsoleNotificationsAdapter implements NotificationsAdapter {
  async sendToAdmins(payload: NotificationPayload): Promise<void> {
    console.info('Admin notification', payload);
  }
}

let adapter: NotificationsAdapter | null = null;

export function notificationsAdapter(): NotificationsAdapter {
  if (!adapter) {
    adapter = new ConsoleNotificationsAdapter();
  }
  return adapter;
}
