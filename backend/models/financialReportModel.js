import mongoose from 'mongoose';

const financialReportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ['income', 'expense', 'balance', 'tenant', 'product', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  summary: {
    totalIncome: Number,
    totalExpenses: Number,
    netIncome: Number,
    occupancyRate: Number
  },
  filters: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
financialReportSchema.index({ reportType: 1, createdAt: -1 });
financialReportSchema.index({ createdBy: 1 });
financialReportSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 });

const FinancialReport = mongoose.model('FinancialReport', financialReportSchema);

export default FinancialReport;
