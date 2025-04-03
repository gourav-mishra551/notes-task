import React, { createContext, useContext, useState, useEffect } from 'react';
import {api} from '../services/api';

// Create the context with default values to avoid null errors
const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => Promise.resolve({ success: false }),
  register: () => Promise.resolve({ success: false }),
  verifyOtp: () => Promise.resolve({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/user');
          setUser(response?.data?.user);
        } catch (error) {
          console.log(error)
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, requiresOtp } = response.data;
      
      if (requiresOtp) {
        return { success: true, requiresOtp: true, email };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('id',user?.id)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, requiresOtp: false };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };
  
  const register = async (userData) => {
    console.log(userData)
    try {
      const response = await api.post('/auth/register', userData);
      return { 
        success: true, 
        message: response.data.message,
        email: userData.email
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };
  
  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP verification failed. Please try again.'
      };
    }
  };
  

  
  const value = {
    user,
    loading,
    login,
    register,
    verifyOtp,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};