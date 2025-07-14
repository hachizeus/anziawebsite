import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: [
      'cash',
      'check',
      'bank transfer',
      'credit card',
      'debit card',
      'paypal',
      'other'
    ],
    default: 'bank transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  subscription: {
    type: String,
    enum: ['basic', 'premium', 'professional'],
    default: 'basic'
  },
  currency: {
    type: String,
    enum: ['KSH', 'USD', 'EUR'],
    default: 'KSH'
  },
  subscriptionExpiry: {
    type: Date,
    default: () => new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month from now
  },
  paymentHistory: [paymentSchema],
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],
  visible: {
    type: Boolean,
    default: true
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  notes: {
    type: String
  }
}, { timestamps: true });

// Check if model already exists to prevent overwrite error
const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);

export default Agent;
