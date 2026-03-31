import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order_id:           { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  order_code:         { type: String, required: true },
  customer_email:     { type: String, required: true },
  gateway:            { type: String, enum: ['razorpay', 'stripe', 'manual', 'upi'], default: 'razorpay' },
  gateway_order_id:   { type: String },   // Razorpay order_id
  gateway_payment_id: { type: String },   // Razorpay payment_id
  gateway_signature:  { type: String },   // Razorpay signature
  amount:             { type: Number, required: true }, // in INR (paise stored separately)
  amount_paise:       { type: Number },    // amount * 100
  currency:           { type: String, default: 'INR' },
  status:             { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  failure_reason:     { type: String },
  metadata:           { type: mongoose.Schema.Types.Mixed },
  created_at:         { type: Date, default: Date.now },
  updated_at:         { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
