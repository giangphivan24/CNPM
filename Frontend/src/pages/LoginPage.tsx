import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import imglogin from '../assets/login.png'; 
import logo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' 
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert("Đăng nhập thành công!");
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:block lg:w-2/3 relative">
        <img 
          src={imglogin} 
          alt="Trường ĐH Bách Khoa" 
          className="absolute inset-0 w-full h-full object-cover"
        />
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}

            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên tài khoản</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vai trò</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#0056b3] appearance-none cursor-pointer outline-none"
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Quên mật khẩu */}
            <div className="flex justify-end pt-2">
              <a href="/forgot-password" className="text-sm text-[#0056b3] hover:text-blue-700 font-bold hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              className="w-full bg-[#0056b3] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              Đăng nhập
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;