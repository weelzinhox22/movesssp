
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
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
    
    try {
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
      
      toast({
        title: "Login com Google realizado",
        description: "Autenticação via Google concluída com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível fazer login com o Google. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithFacebook = async () => {
    // Mock Facebook login - would connect to a real backend with OAuth
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock Facebook user
      const mockFacebookUser: User = {
        id: 'facebook-user-' + Date.now().toString(),
        email: 'user@facebook.com',
        name: 'Facebook User'
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockFacebookUser));
      setUser(mockFacebookUser);
      
      toast({
        title: "Login com Facebook realizado",
        description: "Autenticação via Facebook concluída com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao fazer login com Facebook:", error);
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível fazer login com o Facebook. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, loginWithFacebook, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
