const BaseService = require("./BaseService");

class NotificationService extends BaseService {
  constructor() {
    super("notifications");
  }

  async findByUser(userId) {
    return this.findMany(
      { userId },
      { sortBy: "createdAt", sortOrder: "desc" }
    );
  }

  async markAsRead(notificationId) {
    return this.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId) {
    const unread = await this.findMany({ userId, isRead: false });
    const promises = unread.map((notification) =>
      this.markAsRead(notification.id)
    );
    return Promise.all(promises);
  }

  async createNotification(userId, message, type = "info", link = "#") {
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
