// src/api/mentorApi.ts
import axios from 'axios';
import type { Mentor, BookingData } from '../types/mentor';

// Đảm bảo URL này trùng với port Backend của bạn (5000)
const API_URL = 'http://localhost:5001/api';

// Lấy danh sách Mentor (có search)
export const fetchMentors = async (keyword: string = ''): Promise<Mentor[]> => {
    const response = await axios.get(`${API_URL}/mentors`, {
        params: { search: keyword }
    });
    return response.data;
};

// Lấy chi tiết Mentor
export const fetchMentorById = async (id: string): Promise<Mentor> => {
    const response = await axios.get(`${API_URL}/mentors/${id}`);
    return response.data;
};

// Gửi yêu cầu đăng ký
export const applyToMentor = async (data: BookingData): Promise<any> => {
    // Giả sử bạn lưu token trong localStorage khi đăng nhập
    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_URL}/mentors/apply`, data, {
        headers: {
            'Authorization': `Bearer ${token}`, // Gửi kèm token nếu có
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};