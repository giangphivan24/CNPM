import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import imgforgot from '../assets/forgot-pw.png'; 
import axiosClient from '../api/axiosClient';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        // Gọi API Backend
        await axiosClient.post('/auth/forgot-password', { email });
        
        // Lưu email vào localStorage để trang sau dùng
        localStorage.setItem('resetEmail', email); 
        
        alert(`Mã OTP đã được gửi đến ${email}`);
        navigate('/verify-otp');
    } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi gửi mail");
    }
};

  return (
    <div className="min-h-screen flex">
      {/* Cột trái: Ảnh nền */}
      <div className="hidden lg:block lg:w-2/3 relative">
        <img src={imgforgot} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-start pt-24 items-center bg-white px-8 md:px-16">
        <div className="w-full max-w-md">
          
          {/* Header Logo */}
          <div className="flex items-center justify-center mb-10">
            <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
            <div className="h-10 w-[1px] bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-2xl font-bold text-[#0056b3] leading-none mb-1">BKTutor</h2>
              <p className="text-sm text-gray-500 font-medium">Hỗ trợ trực tuyến</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Quên mật khẩu</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên tài khoản</label>
              <input
                type="email"
                placeholder="Nhập Email của bạn"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <p className="text-center text-gray-500 mb-8 text-sm">Nhập email để nhận mã xác thực</p>
            
            <div className="w-full flex justify-center items-center gap-20 mt-6">
                <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    className="text-gray-500 hover:text-[#0056b3] font-semibold transition-colors px-4 py-2"
                >
                    Hủy
                </button>
                
                <button 
                    type="submit" 
                    className="bg-[#0056b3] text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                    Xác nhận
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;