import axiosClient from './axiosClient';
import type { Notification } from '../types/notification';

// Lấy danh sách thông báo
export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await axiosClient.get('/notifications');
  return response.data;
};

// Đánh dấu đã đọc
export const markAsRead = async (notificationId: string): Promise<any> => {
  const response = await axiosClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = async (): Promise<any> => {
  const response = await axiosClient.patch('/notifications/read-all');
  return response.data;
};

// Xóa thông báo
export const deleteNotification = async (notificationId: string): Promise<any> => {
  const response = await axiosClient.delete(`/notifications/${notificationId}`);
  return response.data;
};
