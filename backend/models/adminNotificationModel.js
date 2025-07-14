import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
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
    enum: ['agent_request', 'product_approval', 'maintenance', 'inquiry', 'contact_message', 'system'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Agent', 'product', 'User', 'MaintenanceRequest', 'Document', 'Form', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AdminNotification = mongoose.models.AdminNotification || mongoose.model("AdminNotification", notificationSchema);

export default AdminNotification;
