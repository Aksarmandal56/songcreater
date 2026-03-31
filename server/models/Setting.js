import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  type: { type: String, required: true }, // music_style, language, mood, order_type, upsell
  value: { type: String, required: true },
  price: { type: Number, default: 0 },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Setting', settingSchema);
