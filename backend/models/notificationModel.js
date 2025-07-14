import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'lease', 'maintenance', 'system', 'appointment'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Automatically delete after 30 days
  }
});

// Index for better query performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
