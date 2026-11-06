import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  type: { type: String, enum: ['Conference', 'Symposium', 'Hackathon', 'Webinar', 'Awards', 'Workshop', 'FDP', 'SDP', 'MDP', 'EDP'], required: true },
  theme: String,
  description: String,
  startDate: Date,
  endDate: Date,
  venue: String,
  isOnline: { type: Boolean, default: false },
  tracks: [String],
  speakers: [{ name: String, title: String, bio: String, photo: String }],
  fees: { type: mongoose.Schema.Types.Mixed },
  deadlines: { registration: Date, abstractSubmission: Date, paperSubmission: Date },
  agenda: [{ time: String, title: String, speaker: String, description: String }],
  registrations: [{ name: String, email: String, phone: String, organisation: String, registeredAt: { type: Date, default: Date.now } }],
  abstractSubmissions: [{ title: String, authors: String, email: String, abstract: String, keywords: [String], filePath: String, submittedAt: { type: Date, default: Date.now }, status: { type: String, default: 'Submitted' } }],
  isActive: { type: Boolean, default: true },
  currentStage: { type: String, default: 'New' },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
