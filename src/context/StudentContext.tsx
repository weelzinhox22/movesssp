
import React, { createContext, useContext, useState } from 'react';
import { Student, Document } from '../models/types';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";

interface StudentContextType {
  student: Student | null;
  documents: Document[];
  loading: boolean;
  submitStudentInfo: (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'uniqueCode'>) => Promise<void>;
  uploadDocument: (type: Document['type'], file: File) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  saveIdCard: () => Promise<string>; // Returns URL to save
}

const StudentContext = createContext<StudentContextType>({
  student: null,
  documents: [],
  loading: false,
  submitStudentInfo: async () => {},
  uploadDocument: async () => {},
  uploadProfilePicture: async () => {},
  saveIdCard: async () => '',
});

export const useStudent = () => useContext(StudentContext);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitStudentInfo = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'uniqueCode'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para continuar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a unique code
    const uniqueCode = 'STU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create new student record
    const newStudent: Student = {
      id: 'student-' + Date.now().toString(),
      ...studentData,
      uniqueCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('student', JSON.stringify(newStudent));
    setStudent(newStudent);
    
    // Update user with studentId
    if (user) {
      const updatedUser = { ...user, studentId: newStudent.id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setLoading(false);
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: `Seu código único é: ${uniqueCode}`,
    });
  };

  const uploadDocument = async (type: Document['type'], file: File) => {
    if (!student) {
      toast({
        title: "Erro",
        description: "Complete o cadastro pessoal primeiro.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we'd upload to server and get back a URL
    // For mock purposes, we'll create a fake URL
    const mockFileUrl = URL.createObjectURL(file);
    
    const newDocument: Document = {
      id: `doc-${Date.now().toString()}`,
      studentId: student.id,
      type,
      fileUrl: mockFileUrl,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    
    // Save to localStorage
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    
    setLoading(false);
    
    toast({
      title: "Documento enviado",
      description: "Seu documento foi enviado e está em análise.",
    });
  };

  const uploadProfilePicture = async (file: File) => {
    if (!student) {
      toast({
        title: "Erro",
        description: "Complete o cadastro pessoal primeiro.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we'd upload to server and get back a URL
    // For mock purposes, we'll create a local URL
    const profileUrl = URL.createObjectURL(file);
    
    const updatedStudent = { ...student, profilePicture: profileUrl };
    setStudent(updatedStudent);
    
    // Save to localStorage
    localStorage.setItem('student', JSON.stringify(updatedStudent));
    
    setLoading(false);
    
    toast({
      title: "Foto atualizada",
      description: "Sua foto de perfil foi atualizada com sucesso.",
    });
  };

  const saveIdCard = async (): Promise<string> => {
    if (!student) {
      toast({
        title: "Erro",
        description: "Complete o cadastro pessoal primeiro.",
        variant: "destructive",
      });
      return '';
    }
    
    // In a real app, this would generate an image on the server
    // For now, we'll return a unique ID to identify the card
    return student.uniqueCode || '';
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        documents,
        loading,
        submitStudentInfo,
        uploadDocument,
        uploadProfilePicture,
        saveIdCard,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
