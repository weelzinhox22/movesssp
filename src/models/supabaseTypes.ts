
export type SupabaseStudent = {
  id: string;
  name: string;
  email: string;
  registration_number: string | null;
  course: string | null;
  graduation_year: string | null;
  campus: string | null;
  profile_picture_url: string | null;
  unique_code: string | null;
  created_at: string;
  updated_at: string;
}

// Function to convert Supabase student data to our application's Student model
export const mapSupabaseToStudent = (supabaseStudent: SupabaseStudent | null): Student | null => {
  if (!supabaseStudent) return null;
  
  return {
    id: supabaseStudent.id,
    name: supabaseStudent.name,
    email: supabaseStudent.email,
    registrationNumber: supabaseStudent.registration_number || '',
    course: supabaseStudent.course || '',
    graduationYear: supabaseStudent.graduation_year || '',
    campus: supabaseStudent.campus || '',
    profilePicture: supabaseStudent.profile_picture_url,
    uniqueCode: supabaseStudent.unique_code,
    createdAt: new Date(supabaseStudent.created_at),
    updatedAt: new Date(supabaseStudent.updated_at)
  };
}

// Function to map our application's Student model to Supabase format
export const mapStudentToSupabase = (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'uniqueCode'>) => {
  return {
    name: student.name,
    email: student.email,
    registration_number: student.registrationNumber,
    course: student.course,
    graduation_year: student.graduationYear,
    campus: student.campus,
    profile_picture_url: student.profilePicture
  };
}
