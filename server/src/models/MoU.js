import mongoose from 'mongoose';

const mouSchema = new mongoose.Schema({
  title: { type: String, required: true },
  parties: [String],
  signatories: [{ name: String, designation: String, organisation: String }],
  startDate: Date,
  endDate: Date,
  renewalNotice: String,
  scope: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confidentiality: { type: String, enum: ['Public', 'Confidential', 'Restricted'], default: 'Confidential' },
  status: { type: String, enum: ['Lead', 'Discussion', 'Drafting', 'Legal/Institutional Review', 'Approved', 'Signed', 'Active', 'Under Review', 'Renewed', 'Expired', 'Terminated'], default: 'Lead' },
  partnerType: String,
  collaborationAreas: [String],
  expectedOutcomes: String,
  geography: String,
  duration: String,
  financialExpectations: String,
  documents: [{ filename: String, originalName: String, path: String, uploadedAt: { type: Date, default: Date.now } }],
  activities: [{ activity: String, date: Date, participants: [String], coordinator: String, outputs: String, evidence: String, funding: String }],
  stageHistory: [{ stage: String, enteredAt: Date, exitedAt: Date, actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  organisationName: String,
}, { timestamps: true });

export default mongoose.model('MoU', mouSchema);
