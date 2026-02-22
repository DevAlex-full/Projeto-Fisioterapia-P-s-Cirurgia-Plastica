import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface Admin {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedAdmin = localStorage.getItem('admin_data');

    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_data', JSON.stringify(data.admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  };

  return (
    <AuthContext.Provider value={{
      admin, token, loading, login, logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};