import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cho trang Login (Không cần MainLayout vì nó full màn hình) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Các route còn lại sẽ nằm trong MainLayout */}
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Route mẫu cho danh sách gia sư */}
         <Route path="/mentors" element={
          <MainLayout>
            <div className="p-10 text-center">Trang danh sách gia sư (Đang phát triển)</div>
          </MainLayout>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
