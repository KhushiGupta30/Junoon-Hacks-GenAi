const BaseService = require('./BaseService');
const { bucket } = require('../gcsClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Helper function to upload a file to Google Cloud Storage.
 * @param {object} file - The file object from multer (req.file).
 * @returns {Promise<string|null>} A promise that resolves with the public URL of the uploaded image, or null if no file.
 */
async function uploadImageToGCS(file) {
  if (!file) return null;

  const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  const blob = bucket.file(`product_images/${uniqueFilename}`);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
    // predefinedAcl: 'publicRead',
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error('GCS Upload Error:', err);
      reject(new Error('Could not upload image.'));
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log(`Image uploaded to ${publicUrl}`);
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}

class ProductService extends BaseService {
  constructor() {
    super('products');
  }

  /**
   * Creates a product document with default stats.
   * This is called by `createWithImage` or directly if no image upload.
   */
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

  /**
   * NEW: Creates a product after uploading an image.
   * @param {object} productData - The text fields from the form.
   * @param {object} file - The image file from multer (req.file).
   */
  async createWithImage(productData, file) {
    const imageUrl = await uploadImageToGCS(file);
    if (!imageUrl) {
      throw new Error('Image upload failed or no image provided.');
    }
    
    productData.images = [{ url: imageUrl, alt: productData.name || 'Product Image' }];
    return await this.create(productData);
  }

  /**
   * NEW: Updates a product, uploading a new image if provided.
   * @param {string} id - The ID of the product to update.
   * @param {object} updateData - The text fields from the form.
   * @param {object} file - The new image file from multer (req.file), or null/undefined.
   */
  async updateWithImage(id, updateData, file) {
    const imageUrl = await uploadImageToGCS(file);

    if (imageUrl) {
      updateData.images = [{ url: imageUrl, alt: updateData.name || 'Product Image' }];
    } else if (updateData.images !== undefined) {
      delete updateData.images;
    }

    return await this.update(id, updateData);
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