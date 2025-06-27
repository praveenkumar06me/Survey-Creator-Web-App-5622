import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedToken = localStorage.getItem('token');
    
    if (savedUserId && savedToken) {
      setUser({ userId: savedUserId, token: savedToken });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = ({ userId, token, newUser }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    setUser({ userId, token, newUser });
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}