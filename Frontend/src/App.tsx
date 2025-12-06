import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import MentorsPage from './pages/MentorsPage';
import MentorDetailPage from './pages/MentorDetailPage';
import EventsPage from './pages/EventsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ForumPage from './pages/ForumPage';
import ProgramPage from './pages/ProgramPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Main Routes - With Layout */}
          <Route path="/" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />

          <Route path="/program" element={
            <MainLayout>
              <ProgramPage />
            </MainLayout>
          } />

          <Route path="/mentors" element={
            <MainLayout>
              <MentorsPage />
            </MainLayout>
          } />

          <Route path="/mentors/:id" element={
            <MainLayout>
              <MentorDetailPage />
            </MainLayout>
          } />

          <Route path="/events" element={
            <MainLayout>
              <EventsPage />
            </MainLayout>
          } />

          <Route path="/dashboard" element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          } />

          <Route path="/profile" element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          } />

          <Route path="/notifications" element={
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          } />

          <Route path="/forum" element={
            <MainLayout>
              <ForumPage />
            </MainLayout>
          } />

          {/* 404 Not Found */}
          <Route path="*" element={
            <MainLayout>
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Trang không tồn tại</h2>
                  <p className="text-gray-500 mb-6">Xin lỗi, trang bạn tìm kiếm không tồn tại.</p>
                  <a href="/" className="bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Về trang chủ
                  </a>
                </div>
              </div>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;