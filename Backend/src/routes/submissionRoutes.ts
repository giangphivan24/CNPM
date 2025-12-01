import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createSubmission } from '../controllers/submissionController';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.post(
  '/', 
  authenticateToken, 
  upload.single('file'), 
  createSubmission
);

export default router;