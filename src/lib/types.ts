
// User Types
export type UserRole = "admin" | "faculty" | "student" | "parent";

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionCode: string;
  isFirstLogin: boolean;
  profilePicture?: string;
  email?: string;
  phone?: string;
}

export interface Admin extends User {
  role: "admin";
}

export interface Faculty extends User {
  role: "faculty";
  classesAssigned: string[]; // Class IDs
  subjects: string[];
}

export interface Student extends User {
  role: "student";
  classId: string;
  parentIds: string[];
  enrollmentNumber: string;
}

export interface Parent extends User {
  role: "parent";
  studentIds: string[]; // Student IDs
  relation: string; // Father, Mother, Guardian, etc.
}

// Institution Types
export interface Institution {
  id: string;
  name: string;
  code: string; // Unique code for the institution
  address: string;
  adminId: string; // Reference to the admin user
  classes: Class[];
}

export interface Class {
  id: string;
  name: string; // e.g., "10th Grade A"
  grade: string; // e.g., "10th"
  section: string; // e.g., "A"
  facultyIds: string[]; // Faculty assigned to this class
  studentIds: string[]; // Students in this class
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

// Communication Types
export interface Message {
  id: string;
  senderId: string;
  recipientIds: string[];
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  participantIds: string[];
  startTime: string;
  endTime: string;
  location: string;
  isOnline: boolean;
  link?: string;
  status: "scheduled" | "cancelled" | "completed";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  creatorId: string; // Admin or Faculty ID
  targetGroups: {
    faculty: boolean;
    students: boolean;
    parents: boolean;
    classIds: string[]; // Specific classes, if any
  };
  timestamp: string;
  important: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}
