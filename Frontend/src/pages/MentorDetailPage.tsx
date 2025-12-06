import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Clock, MapPin, Mail, Calendar, X } from 'lucide-react';
import { fetchMentorById, applyToMentor } from '../api/mentorApi';
import type { Mentor } from '../types/mentor';

const MentorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (id) {
      loadMentor(id);
    }
  }, [id]);

  const loadMentor = async (mentorId: string) => {
    try {
      const data = await fetchMentorById(mentorId);
      setMentor(data);
    } catch (error) {
      console.error('Lỗi tải thông tin mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy gia sư</h2>
          <button onClick={() => navigate('/mentors')} className="text-[#0056b3] hover:underline">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/mentors')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0056b3] font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0056b3] to-[#003d82] px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name || 'M')}&background=ffffff&color=0056b3&size=128`}
                alt={mentor.name || 'Mentor'}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold mb-2">{mentor.name}</h1>
                <p className="text-blue-100 text-lg mb-3">{mentor.department || 'Chưa cập nhật khoa'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {mentor.mentorProfile?.rating?.toFixed(1) || '0.0'} Rating
                  </span>
                  <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                    <Users className="w-4 h-4" />
                    {mentor.mentorProfile?.totalReviews || 0} Đánh giá
                  </span>
                  <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                    <Mail className="w-4 h-4" />
                    {mentor.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#0056b3] rounded"></div>
                Giới thiệu
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {mentor.bio || 'Gia sư chưa cập nhật thông tin giới thiệu.'}
              </p>
            </div>

            {/* Available Days */}
            {mentor.mentorProfile?.availableDays && mentor.mentorProfile.availableDays.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#0056b3] rounded"></div>
                  Lịch dạy học
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.mentorProfile.availableDays.map((day, idx) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Calendar size={16} />
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise / Subjects */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#0056b3] rounded"></div>
                Chuyên môn & Môn học
              </h2>
              
              {mentor.mentorProfile?.expertise && mentor.mentorProfile.expertise.length > 0 ? (
                <div className="grid gap-3">
                  {mentor.mentorProfile.expertise.map((subject, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 hover:border-[#0056b3] transition"
                    >
                      <div className="mb-3 sm:mb-0">
                        <h4 className="font-bold text-gray-800">{subject}</h4>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Linh hoạt
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            Online / Offline
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSubject(subject);
                          setIsModalOpen(true);
                        }}
                        className="bg-[#0056b3] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md w-full sm:w-auto"
                      >
                        Đăng ký học
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Gia sư chưa cập nhật chuyên môn.</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mentor={mentor}
          subject={selectedSubject}
        />
      </div>
    </div>
  );
};

// Booking Modal Component
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
  subject: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, mentor, subject }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applyToMentor({
        mentorId: mentor.id,
        subject: subject,
        date: formData.date,
        time: formData.time,
        reason: formData.reason
      });
      alert('Gửi yêu cầu thành công! Vui lòng chờ gia sư xác nhận.');
      onClose();
      setFormData({ date: '', time: '', reason: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra. Bạn cần đăng nhập để đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-50 rounded-t-2xl">
          <h3 className="text-xl font-bold text-[#0056b3]">Đăng ký học</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Đăng ký học môn <span className="font-bold text-[#0056b3]">{subject}</span> với gia sư{' '}
              <span className="font-bold">{mentor.name}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày học <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ học <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do / Mong muốn <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Mô tả nhu cầu học tập của bạn..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0056b3] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorDetailPage;
