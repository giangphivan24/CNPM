// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';
import nodemailer from 'nodemailer';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: 'Email đã được sử dụng!' });
      return;
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới trong Database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
        name,
        role: role || 'MENTEE', // Mặc định là MENTEE nếu không chọn
      },
    });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
      return;
    }

    // 2. Kiểm tra mật khẩu (So sánh pass nhập vào vs pass đã mã hóa trong DB)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
      return;
    }

    // 3. Tạo Token (JWT)
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Thông tin muốn gói trong token
      process.env.JWT_SECRET as string || 'default_secret', // Khóa bí mật
      { expiresIn: '1d' } // Token hết hạn sau 1 ngày
    );

    // 4. Trả về kết quả
    res.json({
      message: 'Đăng nhập thành công!',
      token, // Trả token về cho Client lưu trữ
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Lấy ID user từ token 
    const userId = req.user?.userId; 

    if (!userId) {
       res.status(400).json({ message: 'Không tìm thấy ID người dùng' });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS  
  }
});

// 1. GỬI MÃ OTP (Forgot Password)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
      return;
    }

    // Tạo mã OTP ngẫu nhiên 4 số
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Thời gian hết hạn: 5 phút sau
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Lưu OTP vào Database
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires }
    });

    // --- GỬI EMAIL ---
    console.log(`>>> MÃ OTP CỦA ${email} LÀ: ${otp} <<<`);

    /*
    await transporter.sendMail({
      from: '"BK Tutor" <no-reply@bktutor.com>',
      to: email,
      subject: 'Mã xác thực quên mật khẩu',
      text: `Mã OTP của bạn là: ${otp}. Mã này hết hạn sau 5 phút.`
    });
    */

    res.json({ message: 'Đã gửi mã OTP vào email!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 2. XÁC THỰC OTP (Verify OTP)
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      res.status(400).json({ message: 'Mã OTP không chính xác!' });
      return;
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      res.status(400).json({ message: 'Mã OTP đã hết hạn!' });
      return;
    }

    // OTP đúng -> Trả về OK
    res.json({ message: 'Xác thực thành công!' });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 3. ĐỔI MẬT KHẨU MỚI (Reset Password)
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    // Validate OTP lần cuối trước khi cho đổi
    if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
       res.status(400).json({ message: 'Yêu cầu không hợp lệ hoặc phiên đã hết hạn' });
       return;
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và Xóa OTP đi (để không dùng lại được)
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpires: null
      }
    });

    res.json({ message: 'Đổi mật khẩu thành công! Hãy đăng nhập lại.' });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};