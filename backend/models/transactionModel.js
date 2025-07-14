import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['rent', 'sale', 'deposit', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'card', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String
}, { timestamps: true });

// Index for faster queries
transactionSchema.index({ productId: 1, date: 1 });
transactionSchema.index({ tenantId: 1, date: 1 });
transactionSchema.index({ type: 1, status: 1, date: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
