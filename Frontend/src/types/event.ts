export type EventType = 'PERSONAL' | 'MEETING' | 'DEADLINE' | 'MENTORING' | 'GROUP_SESSION';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type EventStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  type: EventType;
  priority: Priority;
  location: string | null;
  isCompleted: boolean;
  maxAttendees: number;
  currentAttendees: number;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventAssignment {
  id: string;
  eventId: string;
  userId: string;
  status: EventStatus;
  event?: CalendarEvent;
  createdAt: string;
  updatedAt: string;
}

export interface RescheduleData {
  assignmentId: string;
  newEventId: string;
}
