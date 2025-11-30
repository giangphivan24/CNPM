import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5001/api', // Địa chỉ Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor để tự động gắn Token vào mỗi request (cho các chức năng cần đăng nhập)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;