import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import path from 'path';

export const createSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.userId; // Lấy ID sinh viên từ token JWT
    const { assignmentId } = req.body;

    // Kiểm tra User ID
    if (!studentId) {
      res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
      return;
    }

    // Kiểm tra file
    if (!req.file) {
      res.status(400).json({ message: 'Vui lòng đính kèm tệp nộp bài.' });
      return;
    }

    // Lấy tên file để tạo đường dẫn tương đối (tên file do Multer tạo)
    const relativeFilePath = `uploads/submissions/${req.file.filename}`;
    const now = new Date();
    let isLate = false;

    // 1. Kiểm tra Bài tập và Hạn nộp (dueDate)
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { dueDate: true }
    });

    if (!assignment) {
      res.status(404).json({ message: 'Bài tập không tồn tại.' });
      return;
    }

    // Logic kiểm tra nộp trễ 
    if (assignment.dueDate && now > assignment.dueDate) {
      isLate = true;
      console.warn(`Sinh viên ${studentId} nộp bài trễ cho Assignment ${assignmentId}`);
    }

    // 2. Tìm bản nộp cũ nhất (nếu có)
    const existingSubmission = await prisma.submission.findFirst({
      where: { studentId, assignmentId },
      // Ta tìm bản nộp cũ nhất để cập nhật. Nếu có nhiều bản nộp, ta vẫn chỉ cần
      // một bản để xác định xem có cần UPDATE hay CREATE.
    });

    let submission;

    // 3. Xử lý Nộp lại bài (GHI ĐÈ/OVERWRITE)
    if (existingSubmission) {
      // Nếu đã có bản nộp, thì cập nhật bản nộp đó (lưu bản nộp cuối cùng)
      submission = await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          filePath: relativeFilePath, // Ghi đè đường dẫn file mới
          submissionDate: now,       // Cập nhật thời gian nộp bài mới nhất
          isLate: isLate,            // Cập nhật trạng thái nộp trễ
        },
      });
    } else {
      // Nếu chưa có, tạo bản nộp mới
      submission = await prisma.submission.create({
        data: {
          assignmentId: assignmentId,
          studentId: studentId,
          filePath: relativeFilePath,
          isLate: isLate,
        },
      });
    }

    res.status(201).json({
      message: isLate ? 'Nộp bài thành công (ĐÃ QUÁ HẠN NỘP BÀI)!' : 'Nộp bài thành công!',
      submission
    });

  } catch (error) {
    console.error(error);
    // Xử lý lỗi lưu file/mất kết nối (Exception: Tải lên thất bại)
    res.status(500).json({ message: 'Tải lên thất bại, vui lòng thử lại.' });
  }
};

