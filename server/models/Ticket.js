import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender_name: { type: String },
  sender_role: { type: String },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  ticket_code: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true },
  customer_name: { type: String },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  order_code: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  assigned_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [replySchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema);
