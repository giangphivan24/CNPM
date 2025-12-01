import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';

export const createSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.userId;
    const { assignmentId } = req.body;

    // Kiểm tra xác thực
    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Kiểm tra đã có file chưa
    if (!req.file) {
      res.status(400).json({ message: 'Chưa có file nộp bài.' });
      return;
    }

    const relativeFilePath = `uploads/submissions/${req.file.filename}`.replace(/\\/g, '/');
    
    const now = new Date();
    let isLate = false;

    // Kiểm tra bài tập có tồn tại không và hạn nộp
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { dueDate: true }
    });

    if (!assignment) {
      res.status(404).json({ message: 'Bài tập không tồn tại.' });
      return;
    }

    // So sánh thời gian nộp với hạn chót
    if (assignment.dueDate && now > assignment.dueDate) {
      isLate = true;
    }

    // Kiểm tra xem sinh viên đã nộp lần nào chưa
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId: assignmentId,
        studentId: studentId
      }
    });

    let submission;
    // TH1: Đã nộp -> cập nhật lại
    if (existingSubmission) {
      submission = await prisma.submission.update({
        where: { id: existingSubmission.id }, // Dùng ID của bài nộp cũ để update
        data: {
          filePath: relativeFilePath, 
          submissionDate: now,    
          isLate: isLate,    
        }
      });
    } else {
      // TH2: Chưa nộp -> tạo mới
      submission = await prisma.submission.create({
        data: {
          assignmentId: assignmentId,
          studentId: studentId,
          filePath: relativeFilePath,
          isLate: isLate,
        }
      });
    }

    res.status(201).json({ 
      message: isLate ? 'Nộp bài thành công (Đã quá hạn).' : 'Nộp bài thành công.', 
      submission
    });

  } catch (error) {
    console.error('Lỗi nộp bài:', error);
    res.status(500).json({ message: 'Lỗi server khi nộp bài.' }); 
  }
};