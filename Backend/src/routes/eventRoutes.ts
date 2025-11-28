// src/routes/eventRoutes.ts
import { Router } from 'express';
// Nhập middleware xác thực
import { authenticateToken } from '../middlewares/authMiddleware'; 
// Nhập hàm controller đã viết
import { rescheduleEvent } from '../controllers/eventController'; 

const router = Router();

// Định nghĩa endpoint Đổi lịch
// Phương thức: PUT (thường dùng để cập nhật một tài nguyên)
// Đường dẫn: /api/events/reschedule/:assignmentId
// Trong đó: :assignmentId là ID của bản ghi đăng ký cũ cần đổi
router.put('/reschedule/:assignmentId', authenticateToken, rescheduleEvent); 

export default router;