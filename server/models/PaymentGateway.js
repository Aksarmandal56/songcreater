import mongoose from 'mongoose';

const gatewaySchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true }, // razorpay, stripe
  display_name: { type: String },
  key_id:       { type: String },          // public key
  key_secret:   { type: String },          // secret (store encrypted in production)
  webhook_secret: { type: String },
  is_active:    { type: Boolean, default: false },
  is_test_mode: { type: Boolean, default: true },
  created_at:   { type: Date, default: Date.now },
  updated_at:   { type: Date, default: Date.now }
});

export default mongoose.model('PaymentGateway', gatewaySchema);
