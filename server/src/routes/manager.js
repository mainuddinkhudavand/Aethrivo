import { Router } from 'express';
import { getManagerDashboard } from '../controllers/managerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, authorize('manager'));
router.get('/dashboard', getManagerDashboard);
export default router;
