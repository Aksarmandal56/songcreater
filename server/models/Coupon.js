import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  coupon_type: { type: String, enum: ['fixed', 'percentage'], default: 'percentage' },
  discount_value: { type: Number, required: true },
  min_order_value: { type: Number, default: 0 },
  max_discount: { type: Number, default: null },
  usage_limit: { type: Number, default: null },
  usage_count: { type: Number, default: 0 },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Coupon', couponSchema);
