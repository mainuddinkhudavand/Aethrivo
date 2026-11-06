import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  language: { type: String, default: 'English' },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Online' },
  duration: String,
  fee: String,
  prerequisites: [String],
  outcomes: [String],
  syllabus: [{ module: String, topics: [String] }],
  description: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  certificationNote: { type: String, default: 'External certification preparation is not official third-party certification.' },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
