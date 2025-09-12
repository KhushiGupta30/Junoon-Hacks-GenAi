const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['artisan', 'buyer', 'investor', 'ambassador', 'admin'],
    required: true
  },
  profile: {
    avatar: String,
    bio: String,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    phone: String,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String
    }
  },
  artisanProfile: {
    craftSpecialty: [String],
    experience: Number,
    certifications: [String],
    workingHours: String,
    materialsUsed: [String],
    techniques: [String],
    storyBehindCraft: String,
    achievements: [String]
  },
  investorProfile: {
    investmentRange: {
      min: Number,
      max: Number
    },
    investmentFocus: [String],
    portfolio: [{
      artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amountInvested: Number,
      investmentDate: Date,
      returns: Number
    }]
  },
  ambassadorProfile: {
    region: String,
    artisansSupported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    eventsOrganized: Number,
    volunteerHours: Number,
    specializations: [String]
  },
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    verificationDocuments: [String]
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true }
    }
  },
  stats: {
    profileViews: { type: Number, default: 0 },
    lastActive: Date,
    joinDate: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);