import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, BookOpen, Calendar, 
  Camera, Edit2, Save, X, Star, Award 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    major: '',
    year: '',
    bio: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        department: parsed.department || '',
        major: parsed.major || '',
        year: parsed.year || '',
        bio: parsed.bio || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = () => {
    // TODO: Call API to update profile
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-6">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-[#0056b3] to-[#003d82]"></div>
          
          {/* Avatar & Basic Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0056b3&color=fff&size=128`}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#0056b3] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-md">
                  <Camera size={16} />
                </button>
              </div>
              
              <div className="flex-1 pt-4 md:pt-0">
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'MENTOR' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'MENTOR' ? 'Gia sư' : user.role === 'ADMIN' ? 'Admin' : 'Học viên'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-[#0056b3] text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-[#0056b3]" size={20} />
                Thông tin cá nhân
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{formData.name || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {formData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {formData.phone || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Khoa</label>
                  {isEditing ? (
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                    >
                      <option value="">Chọn khoa</option>
                      <option value="KHMT">Khoa học Máy tính</option>
                      <option value="KTMT">Kỹ thuật Máy tính</option>
                      <option value="HTTT">Hệ thống Thông tin</option>
                      <option value="CNPM">Công nghệ Phần mềm</option>
                      <option value="MMT">Mạng máy tính</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {formData.department || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Chuyên ngành</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Nhập chuyên ngành"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400" />
                      {formData.major || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Năm học</label>
                  {isEditing ? (
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                    >
                      <option value="">Chọn năm</option>
                      <option value="1">Năm 1</option>
                      <option value="2">Năm 2</option>
                      <option value="3">Năm 3</option>
                      <option value="4">Năm 4</option>
                      <option value="5">Năm 5</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {formData.year ? `Năm ${formData.year}` : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Giới thiệu</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Viết vài dòng về bản thân..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none resize-none"
                  />
                ) : (
                  <p className="text-gray-600">{formData.bio || 'Chưa có thông tin giới thiệu.'}</p>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-6 bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Buổi học đã tham gia</span>
                  <span className="font-bold text-gray-800">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Gia sư đang theo</span>
                  <span className="font-bold text-gray-800">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Đánh giá đã gửi</span>
                  <span className="font-bold text-gray-800">8</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Thành tích
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">Học viên tích cực tháng 11</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="text-blue-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">Hoàn thành 10 buổi học</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                >
                  Đổi mật khẩu
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium">
                  Cài đặt thông báo
                </button>
                <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium">
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
