import { Router } from 'express';
import { updateProfile, getAllMentors } from '../controllers/mentorController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllMentors); 

// Protected: Cập nhật hồ sơ (Phải login mới làm được)
router.put('/profile', authenticateToken, updateProfile);

export default router;