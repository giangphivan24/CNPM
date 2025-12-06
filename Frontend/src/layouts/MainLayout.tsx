import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { IoLogOutOutline } from "react-icons/io5";
import { Bell, User, Calendar, Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State quản lý đăng nhập & User
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // State quản lý dropdown thông báo
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Re-check auth status when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    
    if (isConfirm) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  // Lấy chữ cái đầu tên user cho avatar
  const getAvatarLetter = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/program', label: 'Chương trình' },
    { path: '/mentors', label: 'Gia sư' },
    { path: '/events', label: 'Lịch học' },
    { path: '/dashboard', label: 'Bảng điều khiển' },
    { path: '/forum', label: 'Diễn đàn' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-[70px]">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center no-underline">
              <img src={logo} alt="BK Tutor" className="h-[45px] w-auto" />
              <span className="mx-3 text-gray-300 text-2xl font-light">|</span>
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[20px] font-bold text-gray-800">BK Tutor</span>
                <span className="text-[11px] text-gray-500">Hỗ trợ trực tuyến</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium py-2 px-1 border-b-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-[#0056b3] border-[#0056b3]'
                      : 'text-gray-600 border-transparent hover:text-[#0056b3] hover:border-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                      }}
                      className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
                    >
                      <Bell size={22} />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 top-12 w-[340px] bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 font-bold border-b border-gray-100 flex items-center justify-between">
                          <span>Thông báo</span>
                          <Link to="/notifications" className="text-[#0056b3] text-sm font-medium hover:underline">
                            Xem tất cả
                          </Link>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">📚</div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-medium">Yêu cầu học mới</p>
                                <p className="text-xs text-gray-500 mt-0.5">Học viên muốn đăng ký học Toán cao cấp</p>
                                <p className="text-xs text-gray-400 mt-1">5 phút trước</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">✅</div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-medium">Gia sư đã xác nhận</p>
                                <p className="text-xs text-gray-500 mt-0.5">Lịch học của bạn đã được xác nhận</p>
                                <p className="text-xs text-gray-400 mt-1">2 giờ trước</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                      }}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition"
                    >
                      <div className="w-9 h-9 bg-[#0056b3] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                        {getAvatarLetter(user.name)}
                      </div>
                      <span className="hidden sm:block font-medium text-gray-700 text-sm max-w-[100px] truncate">
                        {user.name}
                      </span>
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-100">
                          <p className="font-bold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User size={18} />
                            <span>Hồ sơ cá nhân</span>
                          </Link>
                          <Link
                            to="/events"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Calendar size={18} />
                            <span>Lịch học của tôi</span>
                          </Link>
                          <Link
                            to="/notifications"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Bell size={18} />
                            <span>Thông báo</span>
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition w-full"
                          >
                            <IoLogOutOutline size={18} />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="hidden sm:block text-[#0056b3] font-medium hover:underline"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#0056b3] text-white rounded-full font-medium px-5 py-2.5 hover:bg-[#003d82] transition text-sm shadow-sm"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top duration-200">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-3 px-4 font-medium rounded-lg transition ${
                    isActive(link.path)
                      ? 'text-[#0056b3] bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-3 px-4 font-medium text-[#0056b3] rounded-lg hover:bg-blue-50 transition mt-2"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#003399] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src={logo} alt="BK Tutor" className="h-10 w-auto brightness-0 invert" />
                <span className="mx-3 text-white/30 text-xl">|</span>
                <span className="text-xl font-bold">BK Tutor</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Nền tảng kết nối gia sư trực tuyến dành riêng cho sinh viên Đại học Bách Khoa TP.HCM.
                Học tập hiệu quả, tiến bộ mỗi ngày.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link to="/program" className="hover:text-white transition">Chương trình</Link></li>
                <li><Link to="/mentors" className="hover:text-white transition">Tìm gia sư</Link></li>
                <li><Link to="/events" className="hover:text-white transition">Lịch học</Link></li>
                <li><Link to="/forum" className="hover:text-white transition">Diễn đàn</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>📧 support@bktutor.edu.vn</li>
                <li>📞 (028) 3864 7256</li>
                <li>📍 268 Lý Thường Kiệt, Q.10, TP.HCM</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-blue-200">
            © 2025 BK Tutor - Hỗ trợ gia sư trực tuyến | Đại học Bách Khoa TP.HCM
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;