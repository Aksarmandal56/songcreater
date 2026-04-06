import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  altText: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Banner', bannerSchema);
