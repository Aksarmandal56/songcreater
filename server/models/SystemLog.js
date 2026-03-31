import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user_email: { type: String },
  user_role: { type: String },
  description: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ip_address: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('SystemLog', systemLogSchema);
