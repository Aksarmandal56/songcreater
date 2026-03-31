import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String },
  package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  order_type: { type: String }, // Personal, Business, Institution

  // Extended status flow
  status: {
    type: String,
    enum: ['received', 'processing', 'lyrics_in_progress', 'music_production', 'final_review', 'delivered', 'cancelled', 'pending', 'completed'],
    default: 'received'
  },

  // Song requirements
  language: { type: String },
  music_style: { type: String },
  singer_voice: { type: String },
  mood: { type: String },
  story: { type: String },
  names_to_include: { type: String },
  special_message: { type: String },
  reference_song: { type: String },

  // Deliverables & upsells
  deliverables: [{ type: String }],
  upsell_options: [{ type: String }],
  total_price: { type: Number, default: 0 },

  // Staff assignments
  assigned_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_lyrics_team: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_production_team: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_qa_team: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Production content
  lyrics: { type: String },
  music_prompt: { type: String },
  ai_music_prompt: { type: String },

  // Uploaded files
  audio_mp3: { type: String },
  audio_wav: { type: String },
  audio_instrumental: { type: String },
  video_reel: { type: String },
  lyrics_pdf: { type: String },

  // Notes
  admin_notes: { type: String },
  qa_notes: { type: String },
  rework_reason: { type: String },

  // Dates
  deadline: { type: Date },
  delivery_date: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
