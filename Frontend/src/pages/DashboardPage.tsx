import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, BookOpen, Bell, TrendingUp, Clock, 
  ChevronRight, Star, CheckCircle, AlertCircle 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock data
  const stats = [
    { label: 'Buổi học hoàn thành', value: 12, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Buổi học sắp tới', value: 3, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Gia sư đang theo', value: 2, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Thông báo mới', value: 5, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Toán cao cấp A1', mentor: 'Nguyễn Văn A', time: '09:00 - 11:00', date: 'Hôm nay', status: 'upcoming' },
    { id: 2, subject: 'Lập trình Python', mentor: 'Trần Thị B', time: '14:00 - 16:00', date: 'Ngày mai', status: 'upcoming' },
    { id: 3, subject: 'Vật lý đại cương', mentor: 'Lê Văn C', time: '08:00 - 10:00', date: '05/12/2025', status: 'scheduled' },
  ];

  const recentActivities = [
    { id: 1, type: 'class', message: 'Bạn đã hoàn thành buổi học Toán cao cấp', time: '2 giờ trước' },
    { id: 2, type: 'notification', message: 'Gia sư Nguyễn Văn A đã xác nhận lịch học', time: '5 giờ trước' },
    { id: 3, type: 'review', message: 'Bạn đã đánh giá 5 sao cho gia sư Trần Thị B', time: 'Hôm qua' },
    { id: 4, type: 'class', message: 'Bạn đã đăng ký buổi học Lập trình Python', time: '2 ngày trước' },
  ];

  const recommendedMentors = [
    { id: 1, name: 'Nguyễn Văn A', subject: 'Toán học', rating: 4.9, reviews: 120, image: null },
    { id: 2, name: 'Trần Thị B', subject: 'Lập trình', rating: 4.8, reviews: 85, image: null },
    { id: 3, name: 'Lê Văn C', subject: 'Vật lý', rating: 4.7, reviews: 64, image: null },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Vui lòng đăng nhập</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0056b3] to-[#003d82] rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Xin chào, {user.name || 'Bạn'}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Chào mừng bạn quay lại BK Tutor. Hôm nay bạn muốn học gì?
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/mentors')}
              className="bg-white text-[#0056b3] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Tìm gia sư
            </button>
            <button
              onClick={() => navigate('/events')}
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Xem lịch học
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Lịch học sắp tới</h2>
              <button 
                onClick={() => navigate('/events')}
                className="text-[#0056b3] text-sm font-medium flex items-center gap-1 hover:underline"
              >
                Xem tất cả <ChevronRight size={16} />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-[#0056b3]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{cls.subject}</h4>
                        <p className="text-sm text-gray-500">Gia sư: {cls.mentor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{cls.date}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                        <Clock size={14} />
                        {cls.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Hoạt động gần đây</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'class' ? 'bg-green-100' :
                      activity.type === 'notification' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'class' && <CheckCircle size={16} className="text-green-600" />}
                      {activity.type === 'notification' && <Bell size={16} className="text-blue-600" />}
                      {activity.type === 'review' && <Star size={16} className="text-yellow-600" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Mentors */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Gia sư đề xuất cho bạn</h2>
            <button
              onClick={() => navigate('/mentors')}
              className="text-[#0056b3] text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/mentors/${mentor.id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=0056b3&color=fff`}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{mentor.name}</h4>
                    <p className="text-sm text-gray-500">{mentor.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                      <span className="text-sm text-gray-400">({mentor.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
