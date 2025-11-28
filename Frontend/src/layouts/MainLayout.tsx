import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Đảm bảo bạn đã có ảnh logo

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Để active menu hiện tại
  
  // State quản lý đăng nhập & User
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // State quản lý dropdown thông báo
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Xử lý click ra ngoài để đóng thông báo (giống script JS cũ)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Hàm lấy chữ cái đầu của tên (Avatar)
  const getAvatarLetter = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const isActive = (path: string) => location.pathname === path ? 'text-[#1a73e8]' : 'text-gray-600';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-[70px]">
            
            {/* 1. BRAND / LOGO */}
            <Link to="/" className="flex items-center no-underline">
              <img src={logo} alt="BK Tutor" className="h-[45px] w-auto" />
              <span className="mx-3 text-gray-300 text-2xl font-light">|</span>
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[20px] font-bold text-gray-800">BK Tutor</span>
                <span className="text-[11px] text-gray-500">Hỗ trợ trực tuyến</span>
              </div>
            </Link>

            {/* 2. MENU CHÍNH */}
            <div className="hidden md:flex space-x-8">
              <Link to="/program" className={`font-bold hover:text-[#1a73e8] transition-colors ${isActive('/program')}`}>Chương trình</Link>
              <Link to="/mentors" className={`font-bold hover:text-[#1a73e8] transition-colors ${isActive('/mentors')}`}>Gia sư</Link>
              <Link to="/dashboard" className={`font-bold hover:text-[#1a73e8] transition-colors ${isActive('/dashboard')}`}>Bảng điều khiển</Link>
              <Link to="/forum" className={`font-bold hover:text-[#1a73e8] transition-colors ${isActive('/forum')}`}>Diễn đàn</Link>
            </div>

            {/* 3. USER SECTION (Login/Notif) */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4 relative">
                  
                  {/* Icon Chuông */}
                  <div className="relative cursor-pointer text-gray-600 hover:text-gray-800" 
                       ref={notifRef}
                       onClick={() => setShowNotifications(!showNotifications)}>
                    {/* Icon Bell (Dùng SVG thay cho FontAwesome để nhẹ) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {/* Badge chấm đỏ */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#dc3545] rounded-full border-2 border-white"></span>

                    {/* Dropdown Thông báo */}
                    {showNotifications && (
                      <div className="absolute right-0 top-10 w-[300px] bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden animate-fade-in">
                        <div className="p-3 font-bold border-b border-gray-100 text-sm">Thông báo mới</div>
                        <div className="p-3 border-b border-gray-50 text-sm hover:bg-gray-50 cursor-pointer text-gray-600">
                          Gia sư Nguyễn Văn A đã nhận lớp.
                        </div>
                        <div className="p-3 border-b border-gray-50 text-sm hover:bg-gray-50 cursor-pointer text-gray-600">
                          Bạn có lịch học mới vào ngày mai.
                        </div>
                        <div className="p-2 text-center text-xs text-[#1a73e8] font-semibold cursor-pointer hover:bg-gray-50">
                          Xem tất cả
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar & Tên */}
                  <div className="flex items-center cursor-pointer group" onClick={handleLogout} title="Click để đăng xuất">
                    <div className="w-[40px] h-[40px] bg-[#003399] text-white rounded-full flex items-center justify-center font-bold text-lg mr-2 shadow-sm">
                      {getAvatarLetter(user.name)}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm group-hover:text-[#003399] transition-colors">
                      {user.name}
                    </span>
                  </div>

                </div>
              ) : (
                /* Nút Đăng nhập  */
                <Link to="/login" className="bg-[#1a73e8] text-white rounded-full font-medium px-5 py-2 hover:bg-[#1557b0] transition-colors text-sm shadow-sm">
                  Đăng nhập
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* --- BODY CONTENT --- */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer (Giữ nguyên như cũ hoặc thêm sau) */}
      <footer className="bg-[#003399] text-white py-6 text-center text-sm">
        © 2025 BK Tutor - Hỗ trợ gia sư trực tuyến
      </footer>
    </div>
  );
};

export default MainLayout;