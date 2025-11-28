import banner from '../assets/banner.png'; 

// Định nghĩa dữ liệu giả lập cho Review 
const reviews = [
  { id: 1, name: "Nguyễn Văn A", role: "Học viên", content: "Gia sư rất nhiệt tình, bài giảng dễ hiểu. Rất hài lòng với trải nghiệm!", rating: 5 },
  { id: 2, name: "Trần Thị B", role: "Học viên", content: "Môi trường học thân thiện, chất lượng gia sư tốt. Giúp tôi cải thiện đáng kể điểm số.", rating: 4.5 },
  { id: 3, name: "Lê Văn C", role: "Học viên", content: "Rất hữu ích và hiệu quả. Gia sư hướng dẫn chi tiết từng bài và luôn sẵn lòng hỗ trợ.", rating: 4 },
];

const HomePage = () => {
  // Hàm hiển thị sao (Star Rating)
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="w-full">
      {/* 1. BANNER */}
      <div 
        className="w-full h-[450px] bg-cover bg-center relative mb-12 shadow-sm"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Đánh giá từ học viên</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px] flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-lg text-gray-900">{review.name}</h5>
                <h6 className="text-sm text-gray-500 mb-3">{review.role}</h6>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  "{review.content}"
                </p>
              </div>
              <div className="text-yellow-400 text-lg">
                {renderStars(review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

