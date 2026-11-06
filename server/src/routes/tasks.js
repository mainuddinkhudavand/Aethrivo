import { Router } from 'express';
import { createTask, listTasks, getTask, updateTask, addTaskNote } from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.post('/', authenticate, authorize('admin'), createTask);
router.get('/', authenticate, authorize('admin', 'manager'), listTasks);
router.get('/:id', authenticate, authorize('admin', 'manager'), getTask);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateTask);
router.post('/:id/notes', authenticate, authorize('admin', 'manager'), addTaskNote);
export default router;
