import { Router } from 'express';
import {
  getDashboard, getManagerProgress, getAuditLogs, resetManagerPassword,
  listCourses, createCourse, updateCourse, deleteCourse,
  listEvents, createEvent, updateEvent, deleteEvent,
  listExperts, updateExpertStatus, updateExpert, deleteExpert,
  listMoUs, createMoU, updateMoU, getMoU,
  getTaxonomy, updateTaxonomy, createTaxonomyItem,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/manager-progress', getManagerProgress);
router.get('/audit-logs', getAuditLogs);
router.put('/reset-manager-password', resetManagerPassword);

// Courses
router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Events
router.get('/events', listEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Experts
router.get('/experts', listExperts);
router.put('/experts/:id', updateExpert);
router.patch('/experts/:id', updateExpert);
router.patch('/experts/:id/status', updateExpertStatus);
router.delete('/experts/:id', deleteExpert);

// MoUs
router.get('/mous', listMoUs);
router.post('/mous', createMoU);
router.put('/mous/:id', updateMoU);
router.get('/mous/:id', getMoU);

// Taxonomy
router.get('/taxonomy', getTaxonomy);
router.post('/taxonomy', createTaxonomyItem);
router.put('/taxonomy/:id', updateTaxonomy);

export default router;
