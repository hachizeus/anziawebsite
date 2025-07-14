import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  productMetrics: {
    totalCount: { type: Number, default: 0 },
    newListings: { type: Number, default: 0 },
    rentedCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 }
  },
  financialMetrics: {
    totalEarnings: { type: Number, default: 0 },
    rentalIncome: { type: Number, default: 0 },
    salesIncome: { type: Number, default: 0 }
  },
  locationMetrics: {
    type: Map,
    of: {
      count: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 }
    }
  }
}, { timestamps: true });

// Compound index for efficient querying by period and date
analyticsSchema.index({ period: 1, date: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
