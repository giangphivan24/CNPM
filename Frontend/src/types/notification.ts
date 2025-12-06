export type NotificationType = 
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'MENTEE_REQUEST'
  | 'MENTOR_RESPONSE'
  | 'EVENT_REMINDER'
  | 'EVENT_ASSIGNMENT'
  | 'PROGRESS_UPDATE'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  data: Record<string, any> | null;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
