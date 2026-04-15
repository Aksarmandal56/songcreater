import mongoose from 'mongoose';

const creatorApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String },
  phone: { type: String },
  role: { type: String, required: true },
  languages: { type: String, required: true },
  genres: [{ type: String }],
  portfolio: { type: String },
  recordingSetup: { type: String },
  experienceLevel: { type: String, required: true },
  availability: { type: String, required: true },
  additionalInfo: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('CreatorApplication', creatorApplicationSchema);
