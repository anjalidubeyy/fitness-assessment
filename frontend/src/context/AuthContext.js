import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('fat-token');
      const savedUser = localStorage.getItem('fat-user');
      
      if (token && savedUser) {
        try {
          // Set the user from localStorage first
          setUser(JSON.parse(savedUser));
          
          // Verify the token is still valid and get latest user data
          const response = await API.get('/users/profile');
          const updatedUser = response.data;
          setUser(updatedUser);
          localStorage.setItem('fat-user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Auth check failed:', err);
          // If token is invalid, clear everything
          localStorage.removeItem('fat-token');
          localStorage.removeItem('fat-user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data) => {
    try {
      if (data.token && data.user) {
        setUser(data.user);
        localStorage.setItem('fat-user', JSON.stringify(data.user));
        localStorage.setItem('fat-token', data.token);
        setError(null);
        return true;
      } else {
        setError('Invalid login response');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fat-user');
    localStorage.removeItem('fat-token');
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fat-user', JSON.stringify(updatedUser));
  };

  const setAuthError = (message) => {
    setError(message);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      updateUser,
      setAuthError,
      isAuthenticated: !!user,
      isProfileComplete: user?.profile?.isProfileComplete || false
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
