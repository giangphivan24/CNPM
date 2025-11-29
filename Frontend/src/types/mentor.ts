// src/types/mentor.ts

export interface MentorProfile {
    expertise: string[];
    rating: number;
    totalReviews: number;
    maxMentees: number;
    availableDays: string[];
}

export interface Mentor {
    id: string;
    name: string;
    email: string;
    department: string | null;
    bio: string | null;
    image: string | null;
    mentorProfile: MentorProfile | null;
}

export interface BookingData {
    mentorId: string;
    subject: string;
    date: string;
    time: string;
    reason: string;
}