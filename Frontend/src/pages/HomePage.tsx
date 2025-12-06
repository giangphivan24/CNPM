import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, ArrowRight, Star, CheckCircle, Search } from 'lucide-react';
import banner from '../assets/banner.png'; 

const reviews = [
  { id: 1, name: "Nguyễn Văn A", role: "Học viên", content: "Gia sư rất nhiệt tình, bài giảng dễ hiểu. Rất hài lòng với trải nghiệm!", rating: 5 },
  { id: 2, name: "Trần Thị B", role: "Học viên", content: "Môi trường học thân thiện, chất lượng gia sư tốt. Giúp tôi cải thiện đáng kể điểm số.", rating: 4.5 },
  { id: 3, name: "Lê Văn C", role: "Học viên", content: "Rất hữu ích và hiệu quả. Gia sư hướng dẫn chi tiết từng bài và luôn sẵn lòng hỗ trợ.", rating: 4 },
];

const stats = [
  { number: '500+', label: 'Gia sư', icon: Users },
  { number: '2000+', label: 'Học viên', icon: BookOpen },
  { number: '10000+', label: 'Buổi học', icon: Calendar },
  { number: '4.8/5', label: 'Đánh giá', icon: Star },
];

const features = [
  {
    icon: Users,
    title: 'Gia sư chất lượng cao',
    description: 'Đội ngũ gia sư là sinh viên giỏi, có kinh nghiệm và được tuyển chọn kỹ lưỡng'
  },
  {
    icon: Calendar,
    title: 'Lịch học linh hoạt',
    description: 'Tự do lựa chọn thời gian học phù hợp với lịch trình của bạn'
  },
  {
    icon: Award,
    title: 'Cam kết chất lượng',
    description: 'Hoàn tiền 100% nếu không hài lòng sau buổi học đầu tiên'
  },
  {
    icon: BookOpen,
    title: 'Đa dạng môn học',
    description: 'Hỗ trợ đầy đủ các môn học từ cơ sở đến chuyên ngành'
  },
];

const popularSubjects = [
  { name: 'Toán cao cấp', mentors: 45, color: 'bg-blue-500' },
  { name: 'Lập trình', mentors: 60, color: 'bg-green-500' },
  { name: 'Vật lý', mentors: 30, color: 'bg-purple-500' },
  { name: 'Tiếng Anh', mentors: 40, color: 'bg-orange-500' },
  { name: 'Hóa học', mentors: 25, color: 'bg-pink-500' },
  { name: 'Xác suất thống kê', mentors: 35, color: 'bg-cyan-500' },
];

const HomePage = () => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="w-full h-[500px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Tìm gia sư phù hợp cho bạn
                </h1>
                <p className="text-xl text-gray-200 mb-8">
                  Kết nối với những gia sư giỏi nhất từ Đại học Bách Khoa. 
                  Học tập hiệu quả, tiến bộ mỗi ngày.
                </p>
                
                {/* Search Box */}
                <div className="bg-white rounded-xl p-2 shadow-lg flex items-center gap-2 max-w-xl">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm môn học, gia sư..."
                      className="w-full pl-12 pr-4 py-3 text-gray-800 rounded-lg outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => navigate('/mentors')}
                    className="bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Tìm kiếm
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    Miễn phí đăng ký
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    500+ gia sư
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-7 h-7 text-[#0056b3]" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.number}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Tại sao chọn BK Tutor?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất cho sinh viên Bách Khoa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#0056b3]" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Subjects */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Môn học phổ biến</h2>
              <p className="text-gray-600">Các môn học được học viên quan tâm nhất</p>
            </div>
            <button 
              onClick={() => navigate('/program')}
              className="hidden md:flex items-center gap-2 text-[#0056b3] font-semibold hover:underline"
            >
              Xem tất cả <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSubjects.map((subject, index) => (
              <div 
                key={index}
                onClick={() => navigate('/mentors')}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer text-center group"
              >
                <div className={`w-14 h-14 ${subject.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition`}>
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{subject.name}</h4>
                <p className="text-sm text-gray-500">{subject.mentors} gia sư</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Đánh giá từ học viên</h2>
          <p className="text-gray-600">Hàng ngàn học viên đã tin tưởng và sử dụng BK Tutor</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#0056b3] rounded-full flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">{review.name}</h5>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                "{review.content}"
              </p>
              <div className="text-yellow-400 text-lg">
                {renderStars(review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#0056b3] to-[#003d82] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay để kết nối với gia sư phù hợp nhất cho bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-[#0056b3] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Đăng ký miễn phí
            </button>
            <button
              onClick={() => navigate('/mentors')}
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition"
            >
              Tìm gia sư ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

