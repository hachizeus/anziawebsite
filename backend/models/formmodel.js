import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  formType: {
    type: String,
    default: 'contact',
    enum: ['contact', 'inquiry', 'support']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'read', 'responded']
  }
}, {
  timestamps: true
});

export default mongoose.model('Form', formSchema);