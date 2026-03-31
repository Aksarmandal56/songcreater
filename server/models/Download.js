import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
  order_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  order_code:     { type: String, required: true },
  customer_email: { type: String, required: true },
  file_type:      { type: String, enum: ['mp3', 'wav', 'instrumental', 'video_reel', 'lyrics_pdf'], required: true },
  file_url:       { type: String, required: true },
  file_name:      { type: String },
  expires_at:     { type: Date }, // null = never expires
  download_count: { type: Number, default: 0 },
  max_downloads:  { type: Number, default: 50 },
  is_active:      { type: Boolean, default: true },
  created_at:     { type: Date, default: Date.now }
});

export default mongoose.model('Download', downloadSchema);
