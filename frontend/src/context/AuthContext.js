import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialiser l'authentification depuis le localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      setIsAdmin(JSON.parse(userData).roles?.includes('ADMIN') || false);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('clientId', userData.id);
    
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.roles?.includes('ADMIN') || false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
