import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  _id: string;
  nom: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { nom: string; email: string; motDePasse: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Utiliser les données utilisateur stockées directement
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (token) {
      // Fallback: décoder le token JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData: User = {
          _id: payload._id,
          nom: payload.nom || 'Utilisateur',
          email: payload.email || '',
          role: payload.role || 'utilisateur'
        };
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        localStorage.removeItem('token');
      }
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login(email, password);

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Erreur de connexion'
        : 'Erreur de connexion';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: { nom: string; email: string; motDePasse: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Erreur d\'inscription'
        : 'Erreur d\'inscription';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';
  
  console.log('AuthContext - État:', { 
    user, 
    isAuthenticated, 
    isAdmin,
    userEmail: user?.email 
  });

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
