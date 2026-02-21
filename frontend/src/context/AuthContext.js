import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
      setError(null);
    } catch (err) {
      setError(err);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setError(null);
      return { success: true, message: response.message };
    } catch (err) {
      setError(err);
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authService.signup(userData);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setError(null);
      return { success: true, message: response.message };
    } catch (err) {
      setError(err);
      return { success: false, message: err.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setError(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await authService.updateProfile(updates);
      setUser(response.user);
      setError(null);
      return { success: true, message: 'Profile updated' };
    } catch (err) {
      setError(err);
      return { success: false, message: err.message || 'Update failed' };
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
