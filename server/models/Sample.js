import mongoose from 'mongoose';

const sampleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: String, required: true },
  audio_url: { type: String, default: '' },
  image_url: { type: String, default: '' },
  language: { type: String, default: 'Hindi' },
  category: { type: String, default: 'personal', enum: ['personal', 'business', 'campaign'] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Sample', sampleSchema);
