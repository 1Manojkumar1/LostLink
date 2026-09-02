import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('lostlink_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data?.user || res.data);
      } catch {
        localStorage.removeItem('lostlink_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginWithToken = async (token) => {
    localStorage.setItem('lostlink_token', token);
    const res = await api.get('/auth/me');
    setUser(res.data?.user || res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      localStorage.removeItem('lostlink_token');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    loginWithToken,
    logout,
  }), [user, loading, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};