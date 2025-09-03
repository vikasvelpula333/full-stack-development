import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          // Verify token and get user profile
          const profileData = await authService.getProfile();
          setUser(profileData.user || profileData);
          setTeacher(profileData.teacher);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
          setTeacher(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token: newToken, user: userData, teacher: teacherData } = response.data;

      setToken(newToken);
      setUser(userData);
      setTeacher(teacherData);
      localStorage.setItem('auth_token', newToken);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUser, teacher_id } = response.data;

      setToken(newToken);
      setUser(newUser);
      setTeacher({ id: teacher_id });
      localStorage.setItem('auth_token', newToken);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || {};
      toast.error(message);
      return { success: false, message, errors };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setTeacher(null);
    toast.info('Logged out successfully');
  };

  const updateProfile = (updatedUser, updatedTeacher = null) => {
    setUser(updatedUser);
    if (updatedTeacher) {
      setTeacher(updatedTeacher);
    }
  };

  const isAuthenticated = () => {
    return !!(token && user);
  };

  const value = {
    user,
    teacher,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
