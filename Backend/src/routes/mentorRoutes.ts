import { Router } from 'express';
import { updateProfile, getAllMentors, getMentorById, applyMentor } from '../controllers/mentorController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllMentors);

// Cập nhật hồ sơ (Phải login mới làm được)
router.put('/profile', authenticateToken, updateProfile);
router.get('/', getAllMentors);
router.get('/:id', getMentorById);

// Route Đăng ký (Cần login là Student/User)
router.post('/apply', authenticateToken, applyMentor);

export default router;