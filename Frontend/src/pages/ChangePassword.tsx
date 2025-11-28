import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import imgchange from '../assets/change-pw.png'; 
import axiosClient from '../api/axiosClient';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ newPass: '', confirmPass: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
        alert("Mật khẩu không khớp!");
        return;
    }

    const email = localStorage.getItem('resetEmail');
    const otp = localStorage.getItem('resetOtp');

    try {
        // Gọi API đổi pass (Gửi kèm cả OTP để server tin tưởng)
        await axiosClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword: passwords.newPass
        });

        alert("Đổi mật khẩu thành công!");
        
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetOtp');
        
        navigate('/login');
    } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi đổi mật khẩu");
    }
};

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-2/3 relative">
        <img src={imgchange} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="w-full lg:w-1/3 flex flex-col justify-start pt-24 items-center bg-white px-8 md:px-16">
        <div className="w-full max-w-md">
          
          <div className="flex items-center justify-center mb-10">
            <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
            <div className="h-10 w-[1px] bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-2xl font-bold text-[#0056b3] leading-none mb-1">BKTutor</h2>
              <p className="text-sm text-gray-500 font-medium">Hỗ trợ trực tuyến</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đổi mật khẩu</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none transition-all"
                onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nhập lại mật khẩu</label>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none transition-all"
                onChange={(e) => setPasswords({...passwords, confirmPass: e.target.value})}
                required
              />
            </div>

            <div className="w-full flex justify-center items-center gap-20 mt-6">
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="text-gray-600 hover:text-[#0056b3] font-semibold transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="bg-[#0056b3] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
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

export default ChangePassword;