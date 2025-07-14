import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: false,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: false,
  },
  accessRoles: {
    type: [String],
    enum: ['admin', 'agent', 'landlord', 'tenant'],
    default: ['admin'],
  },
  accessUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  signature: {
    hasSigned: {
      type: Boolean,
      default: false
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    signatureData: String,
    signedAt: Date
  }
}, {
  timestamps: true
});

const Document = mongoose.model("Document", documentSchema);

export default Document;
