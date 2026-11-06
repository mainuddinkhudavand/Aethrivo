import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({ action, entity, entityId, actor, actorEmail, actorRole, details, ip, userAgent }) => {
  try {
    await AuditLog.create({ action, entity, entityId, actor, actorEmail, actorRole, details, ip, userAgent });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};
