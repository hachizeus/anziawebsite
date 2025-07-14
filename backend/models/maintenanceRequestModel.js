import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const maintenanceRequestSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'appliance', 'heating', 'cooling', 'structural', 'pest', 'other'],
    default: 'other'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  availableTimes: {
    type: String,
    trim: true
  },
  images: [String],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  cost: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

// Index for faster queries
maintenanceRequestSchema.index({ tenant: 1, status: 1 });
maintenanceRequestSchema.index({ product: 1 });
maintenanceRequestSchema.index({ assignedTo: 1 });

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

export default MaintenanceRequest;
