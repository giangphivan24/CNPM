import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import logo from '../assets/logo.png';
import imglogin from '../assets/login.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE' 
  });
  
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      await axiosClient.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:block lg:w-2/3 relative">
        <img 
          src={imglogin} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="w-full lg:w-1/3 flex flex-col justify-start pt-10 items-center bg-white px-8 md:px-16 overflow-y-auto">
        <div className="w-full max-w-md pb-10">
          
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
            <div className="h-10 w-[1px] bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-2xl font-bold text-[#0056b3] leading-none mb-1">BKTutor</h2>
              <p className="text-sm text-gray-500 font-medium">Hỗ trợ trực tuyến</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng ký tài khoản</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@hcmut.edu.vn"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bạn là ai?</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#0056b3] appearance-none cursor-pointer outline-none"
                >
                  <option value="MENTEE">Student</option>
                  <option value="MENTOR">Tutor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              className="w-full bg-[#0056b3] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg mt-4"
            >
              Đăng ký ngay
            </button>

            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
              <Link to="/login" className="text-[#0056b3] font-bold text-sm hover:underline">
                Đăng nhập
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;