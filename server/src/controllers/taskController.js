import Task from '../models/Task.js';
import { logAudit } from '../utils/auditLogger.js';

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    await logAudit({ action: 'CREATE_TASK', entity: 'Task', entityId: task._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: req.body, ip: req.ip });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const listTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, assignedTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (req.user.role === 'manager') filter.assignedTo = req.user._id;
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Task.countDocuments(filter);
    res.json({ success: true, data: tasks, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('notes.author', 'name email');
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.body.status === 'Completed') update.completedAt = new Date();
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    await logAudit({ action: 'UPDATE_TASK', entity: 'Task', entityId: task._id.toString(), actor: req.user._id, actorEmail: req.user.email, actorRole: req.user.role, details: req.body, ip: req.ip });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addTaskNote = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    task.notes.push({ text: req.body.text, author: req.user._id });
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
