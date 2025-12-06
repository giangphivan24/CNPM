import axiosClient from './axiosClient';
import type { CalendarEvent, EventAssignment, RescheduleData } from '../types/event';

// Lấy danh sách sự kiện
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await axiosClient.get('/events');
  return response.data;
};

// Lấy chi tiết sự kiện
export const fetchEventById = async (id: string): Promise<CalendarEvent> => {
  const response = await axiosClient.get(`/events/${id}`);
  return response.data;
};

// Lấy lịch đã đăng ký của user
export const fetchMyAssignments = async (): Promise<EventAssignment[]> => {
  const response = await axiosClient.get('/events/my-assignments');
  return response.data;
};

// Đăng ký tham gia sự kiện
export const registerEvent = async (eventId: string): Promise<any> => {
  const response = await axiosClient.post(`/events/${eventId}/register`);
  return response.data;
};

// Đổi lịch học
export const rescheduleEvent = async (data: RescheduleData): Promise<any> => {
  const response = await axiosClient.put(`/events/reschedule/${data.assignmentId}`, {
    newEventId: data.newEventId
  });
  return response.data;
};

// Hủy đăng ký sự kiện
export const cancelRegistration = async (assignmentId: string): Promise<any> => {
  const response = await axiosClient.delete(`/events/assignments/${assignmentId}`);
  return response.data;
};
