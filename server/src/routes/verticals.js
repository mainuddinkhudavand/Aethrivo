import { Router } from 'express';
import { getVerticals, getVerticalBySlug, updateVertical, getAllVerticals } from '../controllers/verticalController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/', getVerticals);
router.get('/all', authenticate, authorize('admin'), getAllVerticals);
router.get('/:slug', getVerticalBySlug);
router.put('/:id', authenticate, authorize('admin'), updateVertical);
export default router;
