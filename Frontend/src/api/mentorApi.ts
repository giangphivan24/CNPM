import axios from 'axios';
import type { Mentor, BookingData } from '../types/mentor';

const API_URL = 'http://localhost:5001/api';

// Lấy danh sách Mentor 
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
    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_URL}/mentors/apply`, data, {
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};