import Vertical from '../models/Vertical.js';
import { logAudit } from '../utils/auditLogger.js';

export const getVerticals = async (req, res) => {
  try {
    const verticals = await Vertical.find({ isActive: true }).sort('order');
    res.json({ success: true, data: verticals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getVerticalBySlug = async (req, res) => {
  try {
    const vertical = await Vertical.findOne({ slug: req.params.slug });
    if (!vertical) return res.status(404).json({ success: false, error: 'Vertical not found' });
    res.json({ success: true, data: vertical });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateVertical = async (req, res) => {
  try {
    const vertical = await Vertical.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vertical) return res.status(404).json({ success: false, error: 'Vertical not found' });
    await logAudit({ action: 'UPDATE_VERTICAL', entity: 'Vertical', entityId: vertical._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: req.body, ip: req.ip });
    res.json({ success: true, data: vertical });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllVerticals = async (req, res) => {
  try {
    const verticals = await Vertical.find().sort('order');
    res.json({ success: true, data: verticals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
