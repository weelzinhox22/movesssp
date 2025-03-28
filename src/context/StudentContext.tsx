
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Document } from '../models/types';
import { SupabaseStudent, mapSupabaseToStudent, mapStudentToSupabase } from '../models/supabaseTypes';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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

  // Fetch student data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchStudentData();
    } else {
      setStudent(null);
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // TypeScript doesn't know about our students table, but Supabase does
      // Type assertion to bypass TypeScript error
      const { data, error } = await supabase
        .from('students' as any)
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      const mappedStudent = mapSupabaseToStudent(data as SupabaseStudent);
      setStudent(mappedStudent);
      
      // Fetch documents (in a real app - here we'll use mock data)
      // For now, we'll use mock documents data
      const mockDocuments: Document[] = [];
      setDocuments(mockDocuments);
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    
    try {
      // Generate a unique code
      const uniqueCode = 'STU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Prepare data for Supabase
      const supabaseData = {
        ...mapStudentToSupabase(studentData),
        unique_code: uniqueCode
      };
      
      // Update student record in Supabase
      // Type assertion to bypass TypeScript error
      const { error } = await supabase
        .from('students' as any)
        .update(supabaseData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Fetch updated data
      await fetchStudentData();
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Seu código único é: ${uniqueCode}`,
      });
    } catch (error) {
      console.error('Error updating student data:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar seus dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    
    try {
      // In a real app, we'd upload to Supabase Storage
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
      
      toast({
        title: "Documento enviado",
        description: "Seu documento foi enviado e está em análise.",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erro ao enviar documento",
        description: "Não foi possível enviar o documento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    if (!student || !user) {
      toast({
        title: "Erro",
        description: "Complete o cadastro pessoal primeiro.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file, {
          upsert: true,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);
      
      // Update user profile with new picture URL
      // Type assertion to bypass TypeScript error
      const { error: updateError } = await supabase
        .from('students' as any)
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      if (student) {
        const updatedStudent: Student = {
          ...student,
          profilePicture: publicUrl
        };
        setStudent(updatedStudent);
      }
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: "Não foi possível atualizar sua foto de perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
