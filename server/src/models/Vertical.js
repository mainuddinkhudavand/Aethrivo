import mongoose from 'mongoose';

const verticalSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  positioningLine: String,
  description: String,
  icon: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  serviceCatalogue: [{ name: String, description: String }],
  enquiryFormFields: [{ name: String, label: String, type: { type: String }, options: [String], required: Boolean }],
  workflow: [{ stage: String, order: Number }],
  guardrailText: String,
  contentBlocks: { type: mongoose.Schema.Types.Mixed, default: {} },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Vertical', verticalSchema);
