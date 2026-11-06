import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['Enquiry', 'Member Review', 'Expert Verification', 'MoU', 'Event', 'Course', 'General'], default: 'General' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed', 'Cancelled'], default: 'Open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedEnquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
  relatedMember: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  relatedExpert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert' },
  relatedMoU: { type: mongoose.Schema.Types.ObjectId, ref: 'MoU' },
  relatedVertical: { type: mongoose.Schema.Types.ObjectId, ref: 'Vertical' },
  dueDate: Date,
  completedAt: Date,
  notes: [{ text: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

taskSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Task', taskSchema);
