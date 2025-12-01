import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware'; 
import { rescheduleEvent } from '../controllers/eventController'; 

const router = Router();

// Phương thức: PUT (thường dùng để cập nhật một tài nguyên)
// Đường dẫn: /api/events/reschedule/:assignmentId
// Trong đó: :assignmentId là ID của bản ghi đăng ký cũ cần đổi
router.put('/reschedule/:assignmentId', authenticateToken, rescheduleEvent); 

export default router;