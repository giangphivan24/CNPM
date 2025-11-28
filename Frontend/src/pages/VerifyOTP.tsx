import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import imgotp from '../assets/otp.png'; 
import axiosClient from '../api/axiosClient';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Logic tự động nhảy ô 
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Logic xóa lùi 
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
        inputRefs.current[index - 1]?.focus();
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const otpCode = otp.join('');
    const email = localStorage.getItem('resetEmail'); // Lấy email từ bước trước

    try {
        // Gọi API Backend check OTP
        await axiosClient.post('/auth/verify-otp', { email, otp: otpCode });
        
        // Lưu tạm OTP để dùng cho bước đổi pass 
        localStorage.setItem('resetOtp', otpCode);
        
        navigate('/change-password');
    } catch (err: any) {
        alert(err.response?.data?.message || "OTP sai hoặc hết hạn");
    }
};

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-2/3 relative">
        <img src={imgotp} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
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

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Xác thực OTP</h2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* 4 Ô nhập OTP */}
            <div className="flex gap-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 border-2 border-gray-300 text-center text-2xl font-bold rounded-lg focus:border-[#0056b3] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            <p className="text-center text-gray-500 mb-8 text-sm">Nhập mã 4 chữ số vừa gửi đến bạn</p>


            <div className="w-full flex justify-center items-center gap-20 mt-6">
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
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

export default VerifyOTP;