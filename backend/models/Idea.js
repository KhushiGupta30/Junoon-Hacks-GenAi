const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
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
  images: [{
    url: String,
    alt: String
  }],
  estimatedPrice: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  estimatedProductionTime: Number,
  materialsNeeded: [String],
  targetAudience: String,
  inspiration: String,
  uniqueSellingPoints: [String],
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: String, enum: ['up', 'down'] },
      date: { type: Date, default: Date.now }
    }]
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  }],
  preOrders: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: Number,
    customization: String,
    maxPrice: Number,
    date: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'in_development', 'available', 'discontinued'],
    default: 'draft'
  },
  developmentGoals: {
    minimumVotes: Number,
    minimumPreOrders: Number,
    targetFunding: Number
  },
  tags: [String]
}, {
  timestamps: true
});

ideaSchema.virtual('totalVotes').get(function() {
  return this.votes.upvotes + this.votes.downvotes;
});

ideaSchema.virtual('voteScore').get(function() {
  return this.votes.upvotes - this.votes.downvotes;
});

module.exports = mongoose.model('Idea', ideaSchema);