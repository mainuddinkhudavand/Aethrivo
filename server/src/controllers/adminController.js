import User from '../models/User.js';
import Member from '../models/Member.js';
import Enquiry from '../models/Enquiry.js';
import Task from '../models/Task.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';
import Expert from '../models/Expert.js';
import MoU from '../models/MoU.js';
import AuditLog from '../models/AuditLog.js';
import ExpertiseTaxonomy from '../models/ExpertiseTaxonomy.js';
import Vertical from '../models/Vertical.js';
import { logAudit } from '../utils/auditLogger.js';

export const getDashboard = async (req, res) => {
  try {
    const [totalMembers, activeMembers, pendingMembers, totalEnquiries, openEnquiries, totalTasks, openTasks, completedTasks, totalExperts, verifiedExperts, totalMoUs, activeMoUs, totalCourses, totalEvents] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ status: 'Active' }),
      Member.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: { $nin: ['Completed', 'Closed'] } }),
      Task.countDocuments(),
      Task.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
      Task.countDocuments({ status: 'Completed' }),
      Expert.countDocuments(),
      Expert.countDocuments({ verificationStatus: 'Verified' }),
      MoU.countDocuments(),
      MoU.countDocuments({ status: 'Active' }),
      Course.countDocuments(),
      Event.countDocuments(),
    ]);
    // Recent members by category
    const membersByCategory = await Member.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    // Enquiries by vertical
    const enquiriesByVertical = await Enquiry.aggregate([{ $group: { _id: '$verticalSlug', count: { $sum: 1 } } }]);
    
    res.json({
      success: true,
      data: {
        totalMembers, activeMembers, pendingMembers,
        totalEnquiries, openEnquiries,
        totalTasks, openTasks, completedTasks,
        totalExperts, verifiedExperts,
        totalMoUs, activeMoUs,
        totalCourses, totalEvents,
        membersByCategory, enquiriesByVertical,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getManagerProgress = async (req, res) => {
  try {
    const manager = await User.findOne({ role: 'manager' });
    if (!manager) return res.status(404).json({ success: false, error: 'Manager not found' });
    const [assignedEnquiries, completedEnquiries, assignedTasks, completedTasks] = await Promise.all([
      Enquiry.countDocuments({ assignedTo: manager._id }),
      Enquiry.countDocuments({ assignedTo: manager._id, status: { $in: ['Completed', 'Closed'] } }),
      Task.countDocuments({ assignedTo: manager._id }),
      Task.countDocuments({ assignedTo: manager._id, status: 'Completed' }),
    ]);
    const recentActivity = await AuditLog.find({ actor: manager._id }).sort({ createdAt: -1 }).limit(20);
    res.json({
      success: true,
      data: {
        manager: { id: manager._id, name: manager.name, email: manager.email, lastLogin: manager.lastLogin },
        assignedEnquiries, completedEnquiries,
        assignedTasks, completedTasks,
        recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entity, actor, startDate, endDate } = req.query;
    const filter = {};
    if (action) filter.action = { $regex: action, $options: 'i' };
    if (entity) filter.entity = entity;
    if (actor) filter.actor = actor;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const logs = await AuditLog.find(filter)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await AuditLog.countDocuments(filter);
    res.json({ success: true, data: logs, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const resetManagerPassword = async (req, res) => {
  try {
    const manager = await User.findOne({ role: 'manager' });
    if (!manager) return res.status(404).json({ success: false, error: 'Manager not found' });
    manager.password = req.body.newPassword;
    manager.mustChangePassword = true;
    await manager.save();
    await logAudit({ action: 'RESET_MANAGER_PASSWORD', entity: 'User', entityId: manager._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, ip: req.ip });
    res.json({ success: true, message: 'Manager password reset' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Course CRUD
export const listCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort('order');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const course = await Course.create({ ...req.body, slug });
    await logAudit({ action: 'CREATE_COURSE', entity: 'Course', entityId: course._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, ip: req.ip });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Event CRUD
export const listEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const event = await Event.create({ ...req.body, slug });
    await logAudit({ action: 'CREATE_EVENT', entity: 'Event', entityId: event._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, ip: req.ip });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Expert management
export const listExperts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;
    const experts = await Expert.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Expert.countDocuments(filter);
    const mapped = experts.map((e) => {
      const obj = e.toObject();
      obj.name = obj.fullName;
      obj.domains = obj.expertiseTags || [];
      return obj;
    });
    res.json({ success: true, data: mapped, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateExpertStatus = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ success: false, error: 'Expert not found' });
    expert.verificationStatus = req.body.status;
    if (req.body.note) expert.verificationNotes.push({ text: req.body.note, author: req.user._id });
    await expert.save();
    await logAudit({ action: 'UPDATE_EXPERT_STATUS', entity: 'Expert', entityId: expert._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: { status: req.body.status }, ip: req.ip });
    res.json({ success: true, data: expert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateExpert = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.expertiseTags === 'string') {
      updateData.expertiseTags = updateData.expertiseTags.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof updateData.languages === 'string') {
      updateData.languages = updateData.languages.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof updateData.qualifications === 'string') {
      updateData.qualifications = updateData.qualifications.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof updateData.trainingTopics === 'string') {
      updateData.trainingTopics = updateData.trainingTopics.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updateData.name && !updateData.fullName) {
      updateData.fullName = updateData.name;
    }

    const expert = await Expert.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!expert) return res.status(404).json({ success: false, error: 'Expert not found' });

    await logAudit({
      action: 'UPDATE_EXPERT',
      entity: 'Expert',
      entityId: expert._id.toString(),
      actor: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      details: { fullName: expert.fullName, verificationStatus: expert.verificationStatus },
      ip: req.ip
    });
    res.json({ success: true, data: expert });
  } catch (err) {
    console.error('Update expert error:', err);
    res.status(400).json({ success: false, error: err.message, message: err.message });
  }
};

export const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ success: false, error: 'Expert not found' });

    await logAudit({
      action: 'DELETE_EXPERT',
      entity: 'Expert',
      entityId: expert._id.toString(),
      actor: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      ip: req.ip
    });
    res.json({ success: true, message: 'Expert removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// MoU CRUD
export const listMoUs = async (req, res) => {
  try {
    const mous = await MoU.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: mous });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createMoU = async (req, res) => {
  try {
    const mou = await MoU.create({
      ...req.body,
      owner: req.user._id,
      stageHistory: [{ stage: req.body.status || 'Lead', enteredAt: new Date() }],
    });
    await logAudit({ action: 'CREATE_MOU', entity: 'MoU', entityId: mou._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, ip: req.ip });
    res.status(201).json({ success: true, data: mou });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateMoU = async (req, res) => {
  try {
    const mou = await MoU.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mou) return res.status(404).json({ success: false, error: 'MoU not found' });
    res.json({ success: true, data: mou });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMoU = async (req, res) => {
  try {
    const mou = await MoU.findById(req.params.id).populate('owner', 'name email');
    if (!mou) return res.status(404).json({ success: false, error: 'MoU not found' });
    res.json({ success: true, data: mou });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Taxonomy
export const getTaxonomy = async (req, res) => {
  try {
    const taxonomy = await ExpertiseTaxonomy.find({ isActive: true }).sort('domain');
    res.json({ success: true, data: taxonomy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateTaxonomy = async (req, res) => {
  try {
    const item = await ExpertiseTaxonomy.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createTaxonomyItem = async (req, res) => {
  try {
    const item = await ExpertiseTaxonomy.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
