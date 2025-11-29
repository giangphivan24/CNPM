import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import { NotificationType, UserRole } from '@prisma/client'; // Import Enum từ Prisma

// 1. Cập nhật hồ sơ Mentor (GIỮ NGUYÊN code cũ của bạn)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { expertise, maxMentees, availableDays, bio } = req.body;

    const profile = await prisma.mentorProfile.upsert({
      where: { userId: userId },
      update: { expertise, maxMentees, availableDays },
      create: { userId, expertise, maxMentees, availableDays }
    });

    if (bio) {
      await prisma.user.update({
        where: { id: userId },
        data: { bio }
      });
    }

    res.json({ message: 'Cập nhật hồ sơ thành công!', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 2. Lấy danh sách Mentor (NÂNG CẤP: Thêm chức năng tìm kiếm)
export const getAllMentors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    // Tạo điều kiện lọc (Where Clause)
    const whereCondition: any = {
      role: UserRole.MENTOR, // Chỉ lấy Mentor
      mentorProfile: { isNot: null } // Mentor phải có profile rồi mới hiện
    };

    // Nếu có từ khóa tìm kiếm
    if (search && typeof search === 'string') {
      const keyword = search.trim();
      whereCondition.OR = [
        { name: { contains: keyword, mode: 'insensitive' } }, // Tìm theo tên
        { department: { contains: keyword, mode: 'insensitive' } }, // Tìm theo khoa
        { mentorProfile: { expertise: { has: keyword } } } // Tìm trong mảng kỹ năng
      ];
    }

    const mentors = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        department: true,
        bio: true,
        image: true,
        mentorProfile: {
          select: {
            expertise: true,
            rating: true,
            totalReviews: true,
            maxMentees: true
          }
        }
      }
    });

    res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 3. Lấy chi tiết một Mentor (MỚI: Dùng cho trang Detail)
export const getMentorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const mentor = await prisma.user.findFirst({
      where: {
        id: id,
        role: UserRole.MENTOR
      },
      include: {
        mentorProfile: true, // Lấy full thông tin profile
        // Có thể include thêm review nếu muốn: receivedReviews: true
      }
    });

    if (!mentor) {
      res.status(404).json({ message: 'Không tìm thấy Mentor' });
      return;
    }

    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

/*
  Cái này tui làm thêm phần gửi yêu cầu làm mentor cho hệ thống dành cho mentee
*/
// 4. Gửi yêu cầu đăng ký học (MỚI: Xử lý Form Modal)
export const applyMentor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.userId; // Lấy ID người đang đăng nhập
    const { mentorId, subject, date, time, reason } = req.body;

    if (!studentId) {
      res.status(401).json({ message: 'Bạn cần đăng nhập để đăng ký' });
      return;
    }

    if (!mentorId || !subject || !date) {
      res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
      return;
    }

    // Tạo thông báo gửi đến Mentor
    // (Theo Schema mới, đây là cách tốt nhất để bắt đầu quy trình kết nối)
    const newNotification = await prisma.notification.create({
      data: {
        userId: mentorId, // Người nhận là Mentor
        type: NotificationType.MENTEE_REQUEST, // Loại thông báo: Yêu cầu từ Mentee
        title: `Yêu cầu học môn: ${subject}`,
        content: `Học viên muốn đặt lịch vào ngày ${date} lúc ${time}. Lý do: ${reason}`,
        isRead: false,
        data: { // Lưu metadata để xử lý sau này
          studentId: studentId,
          bookingDate: date,
          bookingTime: time,
          subject: subject
        }
      }
    });

    res.status(201).json({
      message: 'Đã gửi yêu cầu thành công! Vui lòng chờ Mentor xác nhận.',
      notificationId: newNotification.id
    });

  } catch (error) {
    console.error("Lỗi apply:", error);
    res.status(500).json({ message: 'Lỗi server khi gửi yêu cầu' });
  }
};