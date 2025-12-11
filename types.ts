export enum UserRole {
  ADMIN = 'admin',
  CLUB = 'club',
  STUDENT = 'student'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  usn?: string; // University Seat Number for PACE students
  department?: string; // Derived from USN
  batch?: string; // Derived from USN
}

export enum EventStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubName: string;
  clubId: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  // Digital Approval Documents
  hodLetterUrl?: string;
  principalLetterUrl?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  timestamp: string;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
}

export interface HallBooking {
  id: string;
  hallId: string;
  clubId: string;
  date: string;
  timeSlot: string;
  status: EventStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}