export interface MentorProfile {
  id: string;
  expertise: string[];
  maxMentees: number;
  availableDays: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
  bio?: string;
  mentorProfile?: MentorProfile; // Có thể null nếu user không phải mentor
}