import axiosClient from './axiosClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  major?: string;
  year?: number;
  bio?: string;
  image?: string;
  achievements?: string[];
  createdAt: string;
}

// Đăng nhập
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/login', data);
  return response.data;
};

// Đăng ký
export const register = async (data: RegisterData): Promise<any> => {
  const response = await axiosClient.post('/auth/register', data);
  return response.data;
};

// Lấy thông tin user hiện tại
export const getMe = async (): Promise<UserProfile> => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};

// Quên mật khẩu - gửi OTP
export const forgotPassword = async (email: string): Promise<any> => {
  const response = await axiosClient.post('/auth/forgot-password', { email });
  return response.data;
};

// Xác thực OTP
export const verifyOTP = async (email: string, otp: string): Promise<any> => {
  const response = await axiosClient.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Reset mật khẩu
export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<any> => {
  const response = await axiosClient.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
};
