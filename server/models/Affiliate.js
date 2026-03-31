import mongoose from 'mongoose';

const affiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  coupon_code: { type: String, required: true, unique: true, uppercase: true },
  coupon_type: { type: String, enum: ['fixed', 'percentage'], default: 'percentage' },
  discount_value: { type: Number, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  usage_limit: { type: Number, default: null },
  usage_count: { type: Number, default: 0 },
  orders_generated: { type: Number, default: 0 },
  revenue_generated: { type: Number, default: 0 },
  commission_percent: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Affiliate', affiliateSchema);
