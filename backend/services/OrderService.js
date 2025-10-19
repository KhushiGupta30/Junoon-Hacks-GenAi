const BaseService = require('./BaseService');

class OrderService extends BaseService {
  constructor() {
    super('orders');
  }

  async create(orderData) {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();
    
    return await super.create({
      ...orderData,
      orderNumber,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created',
        updatedBy: orderData.buyer
      }]
    });
  }

  async generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const count = await this.count();
    const sequence = (count + 1).toString().padStart(4, '0');
    return `KG${timestamp}${sequence}`;
  }

  async findByBuyer(buyerId, options = {}) {
    return await this.findMany({ buyer: buyerId }, options);
  }

  async findByArtisan(artisanId, options = {}) {
    // This would require a more complex query since orders contain multiple items
    // For now, we'll get all orders and filter client-side
    const allOrders = await this.findMany({}, options);
    return allOrders.filter(order => 
      order.items.some(item => item.artisan === artisanId)
    );
  }

  async findByStatus(status, options = {}) {
    return await this.findMany({ status }, options);
  }

  async updateStatus(orderId, status, note, updatedBy) {
    const order = await this.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const timeline = order.timeline || [];
    timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy
    });

    return await this.update(orderId, {
      status,
      timeline
    });
  }

  async updateItemStatus(orderId, itemIndex, status) {
    const order = await this.findById(orderId);
    if (!order || !order.items || !order.items[itemIndex]) {
      throw new Error('Order item not found');
    }

    const items = [...order.items];
    items[itemIndex].status = status;

    return await this.update(orderId, { items });
  }

  async updatePaymentStatus(orderId, paymentData) {
    return await this.update(orderId, {
      payment: {
        ...paymentData,
        updatedAt: new Date()
      }
    });
  }

  async updateShipping(orderId, shippingData) {
    return await this.update(orderId, {
      shipping: {
        ...shippingData,
        updatedAt: new Date()
      }
    });
  }

  async addTimelineEntry(orderId, entry) {
    const order = await this.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const timeline = order.timeline || [];
    timeline.push({
      ...entry,
      timestamp: new Date()
    });

    return await this.update(orderId, { timeline });
  }

  async calculateTotal(orderData) {
    const { items, pricing } = orderData;
    
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.priceAtTime * item.quantity;
      if (item.customization?.additionalCost) {
        subtotal += item.customization.additionalCost;
      }
    });

    const tax = pricing?.tax || 0;
    const shipping = pricing?.shipping || 0;
    const discount = pricing?.discount || 0;
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total
    };
  }

  async getOrderStats(artisanId = null) {
    let filter = {};
    if (artisanId) {
      // This would require a more complex query
      // For now, we'll get all orders and filter client-side
      const allOrders = await this.findMany({});
      const filteredOrders = allOrders.filter(order => 
        order.items.some(item => item.artisan === artisanId)
      );
      
      return {
        totalOrders: filteredOrders.length,
        pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
        completedOrders: filteredOrders.filter(o => o.status === 'delivered').length,
        totalRevenue: filteredOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, order) => sum + order.pricing.total, 0)
      };
    }

    const allOrders = await this.findMany({});
    return {
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter(o => o.status === 'pending').length,
      completedOrders: allOrders.filter(o => o.status === 'delivered').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.pricing.total, 0)
    };
  }
}

module.exports = new OrderService();
