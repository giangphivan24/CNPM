import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lưu ý: Dựa vào ảnh, MainLayout đang nằm trong folder 'pages'
import MainLayout from './pages/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --- NHÓM 1: CÁC TRANG KHÔNG CÓ HEADER (AUTH) --- */}
        {/* Khi Logout, code trong MainLayout sẽ navigate('/login'), lọt vào đây -> Mất Header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* --- NHÓM 2: CÁC TRANG CÓ HEADER (MAIN APP) --- */}
        {/* Vì MainLayout của bạn dùng {children}, nên ta bọc component con vào giữa */}

        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />

        <Route path="/mentors" element={
          <MainLayout>
            {/* <Mentors /> <-- Nếu có file thì dùng cái này */}
            <div className="p-10 text-center text-gray-500 font-medium">
              Trang danh sách gia sư (Đang phát triển)
            </div>
          </MainLayout>
        } />

        {/* Các route khác (Dashboard, Forum...) cũng làm tương tự */}
        <Route path="/dashboard" element={
          <MainLayout>
            <div className="p-10 text-center">Bảng điều khiển</div>
          </MainLayout>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;