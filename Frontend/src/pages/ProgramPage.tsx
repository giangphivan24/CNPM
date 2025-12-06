import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, ArrowRight, Star, CheckCircle } from 'lucide-react';

const ProgramPage: React.FC = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: 1,
      title: 'Chương trình Toán học',
      description: 'Hỗ trợ các môn Giải tích, Đại số tuyến tính, Xác suất thống kê...',
      subjects: ['Giải tích 1', 'Giải tích 2', 'Đại số', 'Xác suất'],
      mentorCount: 15,
      studentCount: 200,
      rating: 4.8,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Chương trình Lập trình',
      description: 'Từ cơ bản đến nâng cao: Python, Java, C++, Web Development...',
      subjects: ['Python', 'Java', 'C/C++', 'Web Dev'],
      mentorCount: 20,
      studentCount: 350,
      rating: 4.9,
      color: 'green'
    },
    {
      id: 3,
      title: 'Chương trình Vật lý',
      description: 'Vật lý đại cương, Điện từ học, Cơ học lượng tử...',
      subjects: ['Vật lý 1', 'Vật lý 2', 'Điện từ', 'Quang học'],
      mentorCount: 10,
      studentCount: 120,
      rating: 4.7,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Chương trình Tiếng Anh',
      description: 'TOEIC, IELTS, giao tiếp, viết học thuật...',
      subjects: ['TOEIC', 'IELTS', 'Giao tiếp', 'Academic Writing'],
      mentorCount: 12,
      studentCount: 180,
      rating: 4.8,
      color: 'orange'
    }
  ];

  const features = [
    { icon: Users, title: 'Gia sư chất lượng', description: 'Đội ngũ gia sư là sinh viên xuất sắc, được đào tạo bài bản' },
    { icon: Calendar, title: 'Lịch học linh hoạt', description: 'Tự do sắp xếp thời gian học phù hợp với lịch trình của bạn' },
    { icon: Award, title: 'Cam kết chất lượng', description: 'Hoàn tiền nếu không hài lòng sau buổi học đầu tiên' },
    { icon: BookOpen, title: 'Tài liệu phong phú', description: 'Được cung cấp tài liệu, bài tập và video bài giảng miễn phí' }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-100' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-100' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0056b3] to-[#003d82] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chương trình học tập</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Khám phá các chương trình học được thiết kế riêng cho sinh viên Bách Khoa, 
            giúp bạn đạt kết quả tốt nhất trong học tập.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#0056b3]" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programs List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Các chương trình đang mở</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => {
            const colors = colorClasses[program.color as keyof typeof colorClasses];
            return (
              <div
                key={program.id}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-6 hover:shadow-lg transition cursor-pointer`}
                onClick={() => navigate('/mentors')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text}`}>{program.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold">{program.rating}</span>
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.subjects.map((subject, idx) => (
                    <span key={idx} className={`${colors.badge} ${colors.text} text-xs px-3 py-1 rounded-full font-medium`}>
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {program.mentorCount} gia sư
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {program.studentCount} học viên
                    </span>
                  </div>
                  <span className={`${colors.text} font-semibold text-sm flex items-center gap-1`}>
                    Xem chi tiết <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Đăng ký ngay để được kết nối với gia sư phù hợp và bắt đầu hành trình học tập của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-[#0056b3] text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Đăng ký làm học viên
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-[#0056b3] px-8 py-4 rounded-xl font-semibold border-2 border-[#0056b3] hover:bg-blue-50 transition"
            >
              Đăng ký làm gia sư
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-gray-500 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Miễn phí đăng ký
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Hỗ trợ 24/7
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Cam kết chất lượng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
