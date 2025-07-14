import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  optIn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

export default News;
