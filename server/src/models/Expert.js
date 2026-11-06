import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  memberId: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  qualifications: [String],
  expertiseTags: [String],
  languages: [String],
  feeExpectation: String,
  availability: String,
  cvPath: String,
  experience: String,
  trainingTopics: [String],
  mode: { type: String, enum: ['Online', 'Offline', 'Both'] },
  directoryOptIn: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['Submitted', 'Under Review', 'Verified', 'More Information Required', 'Rejected', 'Suspended'], default: 'Submitted' },
  verificationNotes: [{ text: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
  bio: String,
}, { timestamps: true });

expertSchema.index({ verificationStatus: 1, directoryOptIn: 1 });

export default mongoose.model('Expert', expertSchema);
