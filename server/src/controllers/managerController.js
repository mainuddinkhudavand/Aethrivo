import Enquiry from '../models/Enquiry.js';
import Task from '../models/Task.js';
import Member from '../models/Member.js';

export const getManagerDashboard = async (req, res) => {
  try {
    const managerId = req.user._id;
    const [assignedEnquiries, openEnquiries, completedEnquiries, assignedTasks, openTasks, completedTasks] = await Promise.all([
      Enquiry.countDocuments({ assignedTo: managerId }),
      Enquiry.countDocuments({ assignedTo: managerId, status: { $nin: ['Completed', 'Closed'] } }),
      Enquiry.countDocuments({ assignedTo: managerId, status: { $in: ['Completed', 'Closed'] } }),
      Task.countDocuments({ assignedTo: managerId }),
      Task.countDocuments({ assignedTo: managerId, status: { $in: ['Open', 'In Progress'] } }),
      Task.countDocuments({ assignedTo: managerId, status: 'Completed' }),
    ]);
    const recentEnquiries = await Enquiry.find({ assignedTo: managerId })
      .populate('vertical', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);
    const recentTasks = await Task.find({ assignedTo: managerId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({
      success: true,
      data: {
        assignedEnquiries, openEnquiries, completedEnquiries,
        assignedTasks, openTasks, completedTasks,
        recentEnquiries, recentTasks,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
