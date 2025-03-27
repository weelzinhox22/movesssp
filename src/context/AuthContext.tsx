
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // This would normally check with a real backend
    // For now we'll check localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - would connect to a real backend
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user (this would normally come from the backend)
    const mockUser: User = {
      id: 'user-123',
      email: email,
      name: 'Mock User'
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    // Mock Google login - would connect to a real backend with OAuth
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock Google user
    const mockGoogleUser: User = {
      id: 'google-user-' + Date.now().toString(),
      email: 'user@gmail.com',
      name: 'Google User'
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    setUser(mockGoogleUser);
    setLoading(false);
    
    toast({
      title: "Login com Google realizado",
      description: "Autenticação via Google concluída com sucesso!",
    });
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock registration - would connect to a real backend
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: User = {
      id: 'user-' + Date.now().toString(),
      email: email,
      name: name
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
