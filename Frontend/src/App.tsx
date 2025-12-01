import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />

        <Route path="/mentors" element={
          <MainLayout>
            <div className="p-10 text-center text-gray-500 font-medium">
              Trang danh sách gia sư (Đang phát triển)
            </div>
          </MainLayout>
        } />

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