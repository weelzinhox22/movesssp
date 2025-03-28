export interface Student {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  course: string;
  graduationYear: string;
  campus: string;
  profilePicture?: string; // URL to profile picture
  uniqueCode?: string; // Generated after registration
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  studentId: string;
  type: 'residenceProof' | 'incomeProof' | 'enrollmentProof';
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportantDate {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  studentId?: string; // Reference to Student if they've completed registration
}
