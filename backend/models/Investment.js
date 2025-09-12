const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['grant', 'micro_loan', 'equity_investment', 'pre_order_funding'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  terms: {
    interestRate: Number,
    repaymentPeriod: Number,
    equityPercentage: Number,
    expectedReturns: Number,
    milestones: [String]
  },
  purpose: {
    type: String,
    required: true,
    maxlength: 1000
  },
  businessPlan: {
    description: String,
    targetMarket: String,
    projectedRevenue: Number,
    timeframe: Number,
    riskAssessment: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'funded', 'active', 'completed', 'defaulted', 'cancelled'],
    default: 'pending'
  },
  fundingProgress: {
    amountRaised: { type: Number, default: 0 },
    targetAmount: Number,
    contributors: [{
      investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: Number,
      date: { type: Date, default: Date.now }
    }]
  },
  repayment: {
    schedule: [{
      amount: Number,
      dueDate: Date,
      paidDate: Date,
      status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
    }],
    totalPaid: { type: Number, default: 0 },
    remainingBalance: Number
  },
  documents: [String],
  updates: [{
    date: { type: Date, default: Date.now },
    title: String,
    description: String,
    attachments: [String]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);