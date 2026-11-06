import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  vertical: { type: mongoose.Schema.Types.ObjectId, ref: 'Vertical', required: true },
  verticalSlug: String,
  enquiryNumber: { type: String, unique: true },
  status: { type: String, default: 'New' },
  currentStage: { type: String, default: 'New' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  slaTarget: Date,
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  documents: [{ filename: String, originalName: String, path: String, mimetype: String, size: Number, uploadedAt: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{ text: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
  stageHistory: [{ stage: String, enteredAt: Date, exitedAt: Date, actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
}, { timestamps: true });

enquirySchema.index({ vertical: 1, status: 1 });
enquirySchema.index({ assignedTo: 1 });

export default mongoose.model('Enquiry', enquirySchema);
