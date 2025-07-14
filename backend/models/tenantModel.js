import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/encryptionUtils.js';

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
    default: 'cash'
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

// Define fields that should be encrypted
const ENCRYPTED_FIELDS = ['notes', 'bankDetails', 'ssn', 'emergencyContact'];

const tenantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  leaseStart: {
    type: Date,
    required: true
  },
  leaseEnd: {
    type: Date,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  paymentHistory: [paymentSchema],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  notes: {
    type: String
  },
  // New sensitive fields that will be encrypted
  bankDetails: {
    type: String
  },
  ssn: {
    type: String
  },
  emergencyContact: {
    type: String
  }
}, { timestamps: true });

// Add middleware to encrypt sensitive fields before saving
tenantSchema.pre('save', function(next) {
  // Encrypt sensitive fields
  ENCRYPTED_FIELDS.forEach(field => {
    if (this[field] && this.isModified(field)) {
      this[field] = encrypt(this[field]);
    }
  });
  next();
});

// Add middleware to decrypt sensitive fields when retrieving
tenantSchema.post('init', function() {
  // Decrypt sensitive fields
  ENCRYPTED_FIELDS.forEach(field => {
    if (this[field]) {
      this[field] = decrypt(this[field]);
    }
  });
});

// Add virtual method to get decrypted value
ENCRYPTED_FIELDS.forEach(field => {
  tenantSchema.virtual(`decrypted_${field}`).get(function() {
    return this[field] ? decrypt(this[field]) : null;
  });
});

// Check if model already exists to prevent overwrite error
const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);

export default Tenant;
