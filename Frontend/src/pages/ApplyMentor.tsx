// src/pages/ApplyMentor.tsx
import React, { useState, useEffect } from 'react';
import { Search, Star, Users, ArrowLeft, Clock, MapPin, X } from 'lucide-react';
import { fetchMentors, applyToMentor } from '../api/mentorApi';
import type { Mentor } from '../types/mentor';

// --- COMPONENT: BOOKING MODAL ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: Mentor;
    subject: string;
}

const BookingModal: React.FC<ModalProps> = ({ isOpen, onClose, mentor, subject }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ date: '', time: '', reason: '' });

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
            alert('Gửi yêu cầu thành công! Vui lòng chờ xác nhận.');
            onClose();
        } catch (error) {
            alert('Lỗi: Bạn cần đăng nhập để thực hiện chức năng này.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#fff0f5] p-4 flex justify-between items-center border-b border-pink-100">
                    <h3 className="text-xl font-bold text-[#1a237e]">Nộp Đơn Đăng Ký</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-sm text-gray-600 mb-2">
                        Đăng ký học môn <span className="font-bold text-[#d81b60]">{subject}</span> với Mentor <span className="font-bold">{mentor.name}</span>.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thuê <span className="text-red-500">*</span></label>
                            <input
                                type="date" required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ thuê <span className="text-red-500">*</span></label>
                            <input
                                type="time" required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do / Mong muốn <span className="text-red-500">*</span></label>
                        <textarea
                            rows={3} required
                            placeholder="Nhập nội dung..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit" disabled={loading}
                            className="flex-1 bg-[#d32f2f] hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENT CHÍNH ---
const ApplyMentorPage: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');

    // 1. Fetch Data
    const handleFetch = async (keyword: string) => {
        try {
            const data = await fetchMentors(keyword);
            setMentors(data);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        }
    };

    useEffect(() => {
        handleFetch('');
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleFetch(search);
    };

    // 2. Render List View
    const renderListView = () => (
        <>
            {/* Search Bar */}
            <div className="bg-white p-5 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 border border-gray-100">
                <div className="flex-1 relative">
                    <input
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition"
                        placeholder="Tìm kiếm giảng viên, môn học..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
                <select className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-pointer min-w-[150px]">
                    <option>Tất cả Khoa</option>
                    <option>KHMT</option>
                    <option>KTMT</option>
                </select>
            </div>

            {/* Grid Layout */}
            {mentors.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">Chưa tìm thấy Mentor phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                            <div className="flex gap-4 mb-4">
                                <img
                                    src={mentor.image || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`}
                                    alt={mentor.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-100 shadow-sm"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-[#1a237e]">{mentor.name}</h3>
                                    <p className="text-sm text-[#d81b60] font-medium">{mentor.department}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{mentor.bio}</p>
                                </div>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-2">
                                {mentor.mentorProfile?.expertise.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                                {(mentor.mentorProfile?.expertise.length || 0) > 3 && (
                                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">+...</span>
                                )}
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {mentor.mentorProfile?.rating || 0}</span>
                                    <span className="flex items-center gap-1"><Users size={16} /> {mentor.mentorProfile?.totalReviews || 0} reviews</span>
                                </div>
                                <button
                                    onClick={() => { setSelectedMentor(mentor); setViewMode('detail'); }}
                                    className="bg-[#1a237e] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-900 transition shadow-blue-200 shadow-lg"
                                >
                                    Xem
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );

    // 3. Render Detail View
    const renderDetailView = () => {
        if (!selectedMentor) return null;
        const expertise = selectedMentor.mentorProfile?.expertise || [];

        return (
            <div className="animate-in slide-in-from-right duration-300">
                <button
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2 text-[#1a237e] font-semibold mb-6 hover:underline"
                >
                    <ArrowLeft size={20} /> Quay lại danh sách
                </button>

                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
                        <img
                            src={selectedMentor.image || `https://ui-avatars.com/api/?name=${selectedMentor.name}`}
                            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white ring-2 ring-pink-100"
                        />
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-[#d81b60] mb-2">{selectedMentor.name}</h2>
                            <p className="text-lg text-gray-700 font-medium mb-2">{selectedMentor.department}</p>
                            <p className="text-gray-500 leading-relaxed max-w-2xl">{selectedMentor.bio}</p>

                            <div className="flex gap-6 mt-4">
                                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
                                    <Star className="text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-gray-800">{selectedMentor.mentorProfile?.rating} Rating</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                    <Users className="text-blue-500" />
                                    <span className="font-bold text-gray-800">{selectedMentor.mentorProfile?.totalReviews} Đánh giá</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a237e] mb-6 border-l-4 border-[#1a237e] pl-3">Các lĩnh vực chuyên môn đang mở</h3>

                    <div className="grid gap-4">
                        {expertise.map((subj, index) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between items-center bg-[#fff8fa] p-5 rounded-xl border border-pink-50 hover:border-pink-200 transition">
                                <div className="mb-4 md:mb-0">
                                    <h4 className="font-bold text-lg text-gray-800 mb-1">{subj}</h4>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Clock size={14} /> Linh hoạt</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> Online / Offline</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedSubject(subj); setIsModalOpen(true); }}
                                    className="bg-[#4fc3f7] hover:bg-[#29b6f6] text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-md w-full md:w-auto"
                                >
                                    Đăng ký học
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#fff0f5] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-pink-50">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#1a237e] rounded-lg flex items-center justify-center text-white font-bold text-xl">BK</div>
                        <span className="text-xl font-bold text-[#1a237e] tracking-tight">Tutor</span>
                    </div>
                    <div className="flex gap-4 text-sm font-semibold text-gray-600">
                        <span className="hidden md:block cursor-pointer hover:text-[#1a237e]">Chương trình</span>
                        <span className="text-[#1a237e] bg-pink-50 px-3 py-1 rounded-full cursor-pointer">Gia sư</span>
                        <span className="hidden md:block cursor-pointer hover:text-[#1a237e]">Diễn đàn</span>
                    </div>
                </header>

                {viewMode === 'list' ? renderListView() : renderDetailView()}

                {selectedMentor && (
                    <BookingModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        mentor={selectedMentor}
                        subject={selectedSubject}
                    />
                )}
            </div>
        </div>
    );
};

export default ApplyMentorPage;