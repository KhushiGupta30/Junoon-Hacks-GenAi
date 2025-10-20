const BaseService = require('./BaseService');

class NotificationService extends BaseService {
  constructor() {
    super('notifications');
  }

  // Get all notifications for a user
  async findByUser(userId) {
    return this.findMany({ userId }, { sortBy: 'createdAt', sortOrder: 'desc' });
  }

  // Mark a specific notification as read
  async markAsRead(notificationId) {
    return this.update(notificationId, { isRead: true });
  }

  // Mark all unread notifications for a user as read
  async markAllAsRead(userId) {
    const unread = await this.findMany({ userId, isRead: false });
    const promises = unread.map(notification => this.markAsRead(notification.id));
    return Promise.all(promises);
  }

  // Create a new notification
  async createNotification(userId, message, type = 'info', link = '#') {
    return this.create({
      userId,
      message,
      type,
      link,
      isRead: false,
    });
  }
}

module.exports = new NotificationService();