const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other']
  },
  subcategory: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    title: String,
    description: String
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: { type: String, default: 'cm' }
  },
  materials: [String],
  techniques: [String],
  colors: [String],
  inventory: {
    quantity: { type: Number, default: 1 },
    isUnlimited: { type: Boolean, default: false },
    reservedQuantity: { type: Number, default: 0 }
  },
  customization: {
    isCustomizable: { type: Boolean, default: false },
    customizationOptions: [String],
    additionalCost: Number,
    leadTime: Number
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    domesticShipping: { type: Boolean, default: true },
    internationalShipping: { type: Boolean, default: false },
    shippingCost: Number,
    processingTime: { type: Number, default: 2 },
    estimatedDelivery: { type: Number, default: 7 }
  },
  story: {
    inspiration: String,
    process: String,
    culturalSignificance: String,
    timeToCreate: Number
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'inactive', 'discontinued'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ artisan: 1, status: 1 });

productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = sum / this.reviews.length;
  this.totalReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);