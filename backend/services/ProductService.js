const BaseService = require('./BaseService');

class ProductService extends BaseService {
  constructor() {
    super('products');
  }

  async create(productData) {
    return await super.create({
      ...productData,
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        saves: 0
      },
      averageRating: 0,
      totalReviews: 0
    });
  }

  async findActive(filters = {}, options = {}) {
    return await this.findMany({ ...filters, status: 'active' }, options);
  }

  async findByArtisan(artisanId, options = {}) {
    return await this.findMany({ artisan: artisanId }, options);
  }

  async findByCategory(category, options = {}) {
    return await this.findMany({ category }, options);
  }

  async searchProducts(searchTerm, options = {}) {
    // Note: Firestore doesn't have full-text search built-in
    // You might want to implement this using Algolia or similar service
    // For now, this is a placeholder
    return await this.findMany({}, options);
  }

  async incrementViews(productId) {
    const product = await this.findById(productId);
    if (product) {
      return await this.update(productId, { 
        'stats.views': (product.stats?.views || 0) + 1 
      });
    }
    return null;
  }

  async addReview(productId, reviewData) {
    const product = await this.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const reviews = product.reviews || [];
    reviews.push({
      ...reviewData,
      date: new Date()
    });

    // Calculate new average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return await this.update(productId, {
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  }

  async updateReview(productId, reviewIndex, reviewData) {
    const product = await this.findById(productId);
    if (!product || !product.reviews || !product.reviews[reviewIndex]) {
      throw new Error('Review not found');
    }

    const reviews = [...product.reviews];
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...reviewData,
      date: new Date()
    };

    // Recalculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return await this.update(productId, {
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  }

  async deleteReview(productId, reviewIndex) {
    const product = await this.findById(productId);
    if (!product || !product.reviews || !product.reviews[reviewIndex]) {
      throw new Error('Review not found');
    }

    const reviews = [...product.reviews];
    reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return await this.update(productId, {
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  }

  async updateInventory(productId, quantityChange) {
    const product = await this.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = (product.inventory?.quantity || 0) + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Insufficient inventory');
    }

    return await this.update(productId, {
      'inventory.quantity': newQuantity
    });
  }

  async reserveInventory(productId, quantity) {
    const product = await this.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const availableQuantity = (product.inventory?.quantity || 0) - (product.inventory?.reservedQuantity || 0);
    if (availableQuantity < quantity) {
      throw new Error('Insufficient available inventory');
    }

    return await this.update(productId, {
      'inventory.reservedQuantity': (product.inventory?.reservedQuantity || 0) + quantity
    });
  }

  async releaseInventory(productId, quantity) {
    const product = await this.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const newReservedQuantity = Math.max(0, (product.inventory?.reservedQuantity || 0) - quantity);
    return await this.update(productId, {
      'inventory.reservedQuantity': newReservedQuantity
    });
  }
}

module.exports = new ProductService();
