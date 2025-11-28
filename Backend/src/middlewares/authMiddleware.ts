import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Định nghĩa lại kiểu Request để có thêm biến user
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Lấy token từ header (Format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy phần sau chữ Bearer

  if (!token) {
    res.status(401).json({ message: 'Không tìm thấy Token (Access Denied)' });
    return;
  }

  try {
    // 2. Kiểm tra token 
    const secret = process.env.JWT_SECRET as string || 'default_secret';
    const verified = jwt.verify(token, secret);

    // 3. Nếu đúng, gán thông tin user vào biến req 
    req.user = verified;
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token không hợp lệ!' });
  }
};