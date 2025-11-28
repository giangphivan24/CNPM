import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';

// 1. Cập nhật hồ sơ Mentor (Dành cho người dùng có role là MENTOR)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { expertise, maxMentees, availableDays, bio } = req.body;

    // Kiểm tra xem user này có phải là Mentor không (Tùy chọn, nhưng nên làm)
    const profile = await prisma.mentorProfile.upsert({
      where: { userId: userId },
      update: {
        expertise,   // Mảng các kỹ năng (vd: ["React", "NodeJS"])
        maxMentees,
        availableDays, // vd: ["Monday", "Wednesday"]
      },
      create: {
        userId: userId,
        expertise,
        maxMentees,
        availableDays
      }
    });
    
    // Cập nhật thêm Bio vào bảng User nếu cần
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

// 2. Lấy danh sách tất cả Mentor (Public - Ai xem cũng được)
export const getAllMentors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' }, // Chỉ lấy user là Mentor
      include: {
        mentorProfile: true, // Lấy kèm chi tiết profile
      }
    });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};