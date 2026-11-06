import { Router } from 'express';
import { submitEnquiry, listEnquiries, getEnquiry, updateEnquiryStage, assignEnquiry, addEnquiryNote } from '../controllers/enquiryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.post('/', upload.array('documents', 5), submitEnquiry);
router.get('/', authenticate, authorize('admin', 'manager'), listEnquiries);
router.get('/:id', authenticate, authorize('admin', 'manager'), getEnquiry);
router.patch('/:id/stage', authenticate, authorize('admin', 'manager'), updateEnquiryStage);
router.patch('/:id/assign', authenticate, authorize('admin'), assignEnquiry);
router.post('/:id/notes', authenticate, authorize('admin', 'manager'), addEnquiryNote);
export default router;
