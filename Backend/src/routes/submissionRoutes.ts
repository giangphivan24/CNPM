import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError, FileFilterCallback } from 'multer';
import path from 'path';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createSubmission } from '../controllers/submissionController';

const router = Router();

// Cấu hình Multer để lưu file vào thư mục 'uploads/submissions'
const upload = multer({
  dest: 'uploads/submissions/', // Thư mục tạm để lưu file
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn 10MB (Exception: Tệp quá lớn)
  },
 fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Logic kiểm tra loại file nếu cần thiết
    cb(null, true);
  }
});


router.post(
  '/submissions', 
  authenticateToken, 
  (req: Request, res: Response, next: NextFunction) => { // Khai báo kiểu cho req, res, next
    
    // Middleware Multer, xử lý lỗi file size ở đây
    upload.single('submissionFile')(req, res, (err: Error | MulterError | any) => { // Khai báo kiểu cho err
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Tệp quá lớn (Tối đa 10MB), vui lòng chọn tệp khác.' });
        }
        return res.status(500).json({ message: 'Lỗi tải lên file.' });
      } else if (err) {
        return res.status(500).json({ message: 'Lỗi server khi xử lý file.' });
      }
      next(); // Chuyển sang Controller nếu thành công
    });
  },
  createSubmission
);

export default router;