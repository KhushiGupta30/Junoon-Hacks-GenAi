const { db } = require('../firebase.js');
const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const BaseService = require('./BaseService.js');
const { bucket } = require('../gcsClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Helper function to upload a file to Google Cloud Storage.
 * (This function is unchanged and correct)
 */
async function uploadImageToGCS(file) {
  if (!file) return null;

  const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  const blob = bucket.file(`product_images/${uniqueFilename}`);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
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
   * (This function is unchanged and correct)
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
      totalReviews: 0,
      reviews: [] // Ensure reviews array exists on creation
    });
  }

  /**
   * Creates a product after uploading an image.
   * (This function is unchanged and correct)
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
   * Updates a product, uploading a new image if provided.
   * (This function is unchanged and correct)
   */
  async updateWithImage(id, updateData, file) {
    const imageUrl = await uploadImageToGCS(file);

    if (imageUrl) {
      updateData.images = [{ url: imageUrl, alt: updateData.name || 'Product Image' }];
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

  /**
   * --- CORRECTED ---
   * Uses Firebase Admin SDK syntax
   */
  async incrementViews(productId) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();

    if (productSnap.exists) {
      await productRef.update({ 
        'stats.views': FieldValue.increment(1) 
      });
      const data = productSnap.data();
      return { ...data, stats: { ...data.stats, views: (data.stats?.views || 0) + 1 } };
    }
    return null;
  }

  /**
   * --- CORRECTED ---
   * Adds a review to a product and denormalizes it to the 'reviews' collection.
   * Uses Firebase Admin SDK syntax
   */
  async addReview(productId, reviewData) {
    // 1. Get correct Admin SDK references
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();

    // --- THIS IS THE FIX ---
    // Changed `productSnap.exists()` to `productSnap.exists`
    if (!productSnap.exists) {
        throw new Error('Product not found');
    }

    const product = productSnap.data();
    const artisanId = product.artisan; 

    const hasReviewed = product.reviews?.some(r => r.userId === reviewData.userId);
    if (hasReviewed) {
        throw new Error('You have already reviewed this product.');
    }

    // 2. Generate a unique ID using Admin SDK
    const newReviewRef = db.collection('reviews').doc();
    const newReview = {
        ...reviewData,
        date: Timestamp.now().toDate().toISOString(),
        _id: newReviewRef.id // Use the generated ID
    };

    // 3. Update the product doc using Admin SDK
    await productRef.update({
        reviews: FieldValue.arrayUnion(newReview), // Use FieldValue.arrayUnion
        totalReviews: FieldValue.increment(1), // Use FieldValue.increment
        // Calculate new rating
        averageRating: ((product.averageRating || 0) * (product.totalReviews || 0) + newReview.rating) / ((product.totalReviews || 0) + 1)
    });

    // 4. Denormalize: Add review to the top-level 'reviews' collection
    const reviewDocData = {
        ...newReview,
        artisanId: artisanId,
        productId: productId,
        productName: product.name,
        productImage: product.images?.[0]?.url || null,
    };
    
    // 5. Set the new review doc using Admin SDK
    await newReviewRef.set(reviewDocData);

    const updatedProductSnap = await productRef.get();
    return updatedProductSnap.data();
  }

  /**
   * --- CORRECTED ---
   * Adds a reply to a review.
   * Uses Firebase Admin SDK syntax
   */
  static async replyToReview(reviewId, replyText, artisanId) {
      // 1. Get correct Admin SDK references
      const reviewRef = db.collection('reviews').doc(reviewId);
      const reviewSnap = await reviewRef.get();

      if (!reviewSnap.exists) {
          throw new Error('Review not found.');
      }

      const review = reviewSnap.data();

      if (review.artisanId !== artisanId) {
          throw new Error('Review not found or you do not have permission to reply.');
      }

      const reply = {
          text: replyText,
          date: Timestamp.now().toDate().toISOString(),
      };

      // 2. Update the 'reviews' collection document
      await reviewRef.update({ reply: reply });

      // 3. Update the 'products' collection (nested review array)
      const productRef = db.collection('products').doc(review.productId);
      const productSnap = await productRef.get();

      if (productSnap.exists) {
          const product = productSnap.data();
          const reviewIndex = product.reviews.findIndex(r => r._id === reviewId);
          
          if (reviewIndex > -1) {
              const updatedReviews = [...product.reviews];
              updatedReviews[reviewIndex].reply = reply;
              
              // 4. Update the product doc using Admin SDK
              await productRef.update({ reviews: updatedReviews });
          }
      }

      return { ...review, reply };
  }


  // --- All functions below are also corrected to use Admin SDK syntax ---

  async updateReview(productId, reviewIndex, reviewData) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();
    
    if (!productSnap.exists) {
      throw new Error('Product not found');
    }

    const product = productSnap.data();
    
    if (!product.reviews || !product.reviews[reviewIndex]) {
      throw new Error('Review not found');
    }

    const reviews = [...product.reviews];
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...reviewData,
      date: Timestamp.now().toDate().toISOString() // Use Admin SDK Timestamp
    };

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await productRef.update({ // Use direct update
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
    
    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async deleteReview(productId, reviewIndex) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();
    
    if (!productSnap.exists) {
      throw new Error('Product not found');
    }

    const product = productSnap.data();
    
    if (!product.reviews || !product.reviews[reviewIndex]) {
      throw new Error('Review not found');
    }

    const reviews = [...product.reviews];
    reviews.splice(reviewIndex, 1);

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await productRef.update({ // Use direct update
      reviews,
      averageRating,
      totalReviews: reviews.length
    });

    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async updateInventory(productId, quantityChange) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      throw new Error('Product not found');
    }
    
    const product = productSnap.data();
    const newQuantity = (product.inventory?.quantity || 0) + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Insufficient inventory');
    }

    await productRef.update({ // Use direct update
      'inventory.quantity': newQuantity
    });

    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async reserveInventory(productId, quantity) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      throw new Error('Product not found');
    }

    const product = productSnap.data();
    const availableQuantity = (product.inventory?.quantity || 0) - (product.inventory?.reservedQuantity || 0);
    
    if (availableQuantity < quantity) {
      throw new Error('Insufficient available inventory');
    }

    // Use FieldValue.increment for safer concurrent updates
    await productRef.update({
      'inventory.reservedQuantity': FieldValue.increment(quantity)
    });
    
    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async releaseInventory(productId, quantity) {
    const productRef = this.collectionRef.doc(productId); // Use collectionRef from BaseService
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      throw new Error('Product not found');
    }
    
    const product = productSnap.data();
    const currentReserved = product.inventory?.reservedQuantity || 0;
    const newReservedQuantity = Math.max(0, currentReserved - quantity);

    await productRef.update({
      'inventory.reservedQuantity': newReservedQuantity
    });

    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }
}

module.exports = new ProductService();

