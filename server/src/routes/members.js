import { Router } from 'express';
import { registerMember, verifyEmail, getMemberCard, listMembers, updateMemberStatus, getMember } from '../controllers/memberController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.post('/register', upload.single('cv'), registerMember);
router.get('/verify-email', verifyEmail);
router.get('/card/:memberId', getMemberCard);
router.get('/', authenticate, authorize('admin', 'manager'), listMembers);
router.get('/:id', authenticate, authorize('admin', 'manager'), getMember);
router.patch('/:id/status', authenticate, authorize('admin'), updateMemberStatus);
export default router;
