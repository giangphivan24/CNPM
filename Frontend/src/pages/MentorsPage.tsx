import React, { useState, useEffect } from 'react';
import { Search, Star, Users, Filter, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMentors } from '../api/mentorApi';
import type { Mentor } from '../types/mentor';

const MentorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const departments = [
    { value: '', label: 'Tất cả khoa' },
    { value: 'KHMT', label: 'Khoa học Máy tính' },
    { value: 'KTMT', label: 'Kỹ thuật Máy tính' },
    { value: 'HTTT', label: 'Hệ thống Thông tin' },
    { value: 'CNPM', label: 'Công nghệ Phần mềm' },
    { value: 'MMT', label: 'Mạng máy tính' },
  ];

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async (keyword: string = '') => {
    setLoading(true);
    try {
      const data = await fetchMentors(keyword);
      setMentors(data);
    } catch (error) {
      console.error('Lỗi tải danh sách mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMentors(search);
  };

  const filteredMentors = department
    ? mentors.filter(m => m.department?.includes(department))
    : mentors;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Danh sách Gia sư</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm gia sư phù hợp với nhu cầu học tập của bạn. Đội ngũ gia sư chất lượng cao từ Đại học Bách Khoa.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, môn học, kỹ năng..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#0056b3]"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <button
              type="submit"
              className="bg-[#0056b3] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-bold text-[#0056b3]">{filteredMentors.length}</span> gia sư
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy gia sư</h3>
            <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          /* Mentor Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group"
                onClick={() => navigate(`/mentors/${mentor.id}`)}
              >
                {/* Avatar & Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name || 'M')}&background=0056b3&color=fff`}
                    alt={mentor.name || 'Mentor'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-[#0056b3] transition"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-[#0056b3] transition">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-[#0056b3] font-medium">{mentor.department || 'Chưa cập nhật'}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{mentor.bio || 'Chưa có mô tả'}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.mentorProfile?.expertise?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-[#0056b3] text-xs px-3 py-1 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                  {(mentor.mentorProfile?.expertise?.length || 0) > 3 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                      +{(mentor.mentorProfile?.expertise?.length || 0) - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star size={16} className="fill-yellow-500" />
                      {mentor.mentorProfile?.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users size={16} />
                      {mentor.mentorProfile?.totalReviews || 0} đánh giá
                    </span>
                  </div>
                  <span className="text-[#0056b3] font-semibold text-sm group-hover:underline">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsPage;
