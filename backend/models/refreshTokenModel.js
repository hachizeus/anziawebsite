import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  userAgent: String,
  ipAddress: String
}, {
  timestamps: true
});

// Index for faster lookups and automatic expiration
RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ expiresAt: 1 });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
