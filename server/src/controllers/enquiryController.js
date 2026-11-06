import Enquiry from '../models/Enquiry.js';
import Vertical from '../models/Vertical.js';
import { logAudit } from '../utils/auditLogger.js';

export const submitEnquiry = async (req, res) => {
  try {
    let vertical = null;
    if (req.body.verticalSlug) {
      vertical = await Vertical.findOne({ slug: req.body.verticalSlug });
    } else if (req.body.vertical) {
      vertical = await Vertical.findById(req.body.vertical).catch(() => null);
    }
    if (!vertical) {
      vertical = await Vertical.findOne();
    }

    const count = await Enquiry.countDocuments();
    const enquiryNumber = `ENQ-${String(count + 1).padStart(6, '0')}`;
    const documents = req.files ? req.files.map(f => ({ filename: f.filename, originalName: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size })) : [];
    
    const enquiry = await Enquiry.create({
      vertical: vertical ? vertical._id : undefined,
      verticalSlug: vertical ? vertical.slug : (req.body.verticalSlug || 'general'),
      enquiryNumber,
      formData: req.body,
      contactName: req.body.contactName || req.body.name || 'Anonymous',
      contactEmail: req.body.contactEmail || req.body.email || '',
      contactPhone: req.body.contactPhone || req.body.phone || '',
      documents,
      currentStage: vertical?.workflow?.[0]?.stage || 'New',
      stageHistory: [{ stage: vertical?.workflow?.[0]?.stage || 'New', enteredAt: new Date() }],
    });
    res.status(201).json({ success: true, data: { enquiryNumber: enquiry.enquiryNumber } });
  } catch (err) {
    console.error('Enquiry submission error:', err);
    res.status(400).json({ success: false, error: err.message, message: err.message });
  }
};

export const listEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, vertical, status, assignedTo, search } = req.query;
    const filter = {};
    if (vertical) filter.verticalSlug = vertical;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (req.user.role === 'manager') filter.assignedTo = req.user._id;
    if (search) filter.$or = [
      { enquiryNumber: { $regex: search, $options: 'i' } },
      { contactName: { $regex: search, $options: 'i' } },
      { contactEmail: { $regex: search, $options: 'i' } },
    ];
    const enquiries = await Enquiry.find(filter)
      .populate('vertical', 'name slug')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Enquiry.countDocuments(filter);
    const mapped = enquiries.map((e) => {
      const obj = e.toObject();
      obj.name = obj.contactName || obj.formData?.name || obj.formData?.contactName || 'Anonymous';
      obj.email = obj.contactEmail || obj.formData?.email || obj.formData?.contactEmail || '';
      obj.phone = obj.contactPhone || obj.formData?.phone || '';
      obj.stage = obj.currentStage || obj.status || 'New';
      obj.verticalTitle = obj.vertical?.name || obj.verticalSlug || 'General';
      obj.message = obj.formData?.message || obj.formData?.requirement || obj.formData?.notes || '';
      return obj;
    });
    res.json({ success: true, data: mapped, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('vertical')
      .populate('assignedTo', 'name email')
      .populate('notes.author', 'name email');
    if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    const obj = enquiry.toObject();
    obj.name = obj.contactName || obj.formData?.name || obj.formData?.contactName || 'Anonymous';
    obj.email = obj.contactEmail || obj.formData?.email || obj.formData?.contactEmail || '';
    obj.phone = obj.contactPhone || obj.formData?.phone || '';
    obj.stage = obj.currentStage || obj.status || 'New';
    obj.verticalTitle = obj.vertical?.name || obj.verticalSlug || 'General';
    obj.message = obj.formData?.message || obj.formData?.requirement || obj.formData?.notes || '';
    res.json({ success: true, data: obj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateEnquiryStage = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    const prevStage = enquiry.currentStage;
    // Close previous stage
    const lastHistory = enquiry.stageHistory[enquiry.stageHistory.length - 1];
    if (lastHistory) lastHistory.exitedAt = new Date();
    enquiry.currentStage = req.body.stage;
    enquiry.status = req.body.stage;
    enquiry.stageHistory.push({ stage: req.body.stage, enteredAt: new Date(), actor: req.user._id });
    await enquiry.save();
    await logAudit({ action: 'UPDATE_ENQUIRY_STAGE', entity: 'Enquiry', entityId: enquiry._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: { from: prevStage, to: req.body.stage }, ip: req.ip });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const assignEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.assignedTo, priority: req.body.priority, slaTarget: req.body.slaTarget },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    await logAudit({ action: 'ASSIGN_ENQUIRY', entity: 'Enquiry', entityId: enquiry._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: { assignedTo: req.body.assignedTo }, ip: req.ip });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addEnquiryNote = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    enquiry.notes.push({ text: req.body.text, author: req.user._id });
    await enquiry.save();
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
