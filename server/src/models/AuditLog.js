import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: String,
  entityId: String,
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String,
  actorRole: String,
  details: { type: mongoose.Schema.Types.Mixed },
  ip: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
