import { Router } from 'express';
import Course from '../models/Course.js';
import Event from '../models/Event.js';
import Expert from '../models/Expert.js';
import ExpertiseTaxonomy from '../models/ExpertiseTaxonomy.js';

const router = Router();

router.get('/courses', async (req, res) => {
  try {
    const { category, search, level, mode } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (mode) filter.mode = mode;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const courses = await Course.find(filter).sort('order');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/courses/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .select('-registrations -abstractSubmissions')
      .sort({ startDate: 1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/events/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isActive: true })
      .select('-registrations -abstractSubmissions');
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/events/:slug/register', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    event.registrations.push(req.body);
    await event.save();
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/experts', async (req, res) => {
  try {
    const experts = await Expert.find({ verificationStatus: 'Verified', directoryOptIn: true })
      .select('fullName email phone memberId expertiseTags languages mode bio experience qualifications trainingTopics availability feeExpectation');
    // Map to ensure both fullName and name, expertiseTags and domains are present
    const mapped = experts.map((e) => {
      const obj = e.toObject();
      obj.name = obj.fullName;
      obj.domains = obj.expertiseTags || [];
      return obj;
    });
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/taxonomy', async (req, res) => {
  try {
    const taxonomy = await ExpertiseTaxonomy.find({ isActive: true }).sort('domain');
    res.json({ success: true, data: taxonomy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
