import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollIntervalRef = useRef(null);

  // Load user from sessionStorage on mount so each tab is isolated
  useEffect(() => {
    const storedUser = sessionStorage.getItem('hireverse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem('hireverse_user');
      }
    }
    setLoading(false);
  }, []);

  // Poll for unread notification count every 30s when logged in
  const fetchUnreadCount = useCallback(async (token) => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = data.count ?? 0;
      setUnreadCount(count);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (user?.token) {
      fetchUnreadCount(user.token);
      pollIntervalRef.current = setInterval(() => fetchUnreadCount(user.token), 30000);
    } else {
      setUnreadCount(0);
      clearInterval(pollIntervalRef.current);
    }
    return () => clearInterval(pollIntervalRef.current);
  }, [user?.token, fetchUnreadCount]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const userData = response.data;
      sessionStorage.setItem('hireverse_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (name, email, password, accountType, companyDetails, employmentStatus, workExperience, education) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name, email, password, accountType,
        ...(companyDetails && { companyDetails }),
        ...(employmentStatus && { employmentStatus }),
        ...(workExperience && { workExperience }),
        ...(education && { education }),
      });
      const userData = response.data;
      sessionStorage.setItem('hireverse_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('hireverse_user');
    setUser(null);
    setUnreadCount(0);
  };

  const updateProfile = async (profileData) => {
    try {
      const token = user?.token;
      if (!token) return { success: false, message: 'Not authenticated' };

      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = { ...user, ...response.data };
      sessionStorage.setItem('hireverse_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  const handleFollowToggle = (followingArray) => {
    if (user) {
      const updatedUser = { ...user, following: followingArray };
      sessionStorage.setItem('hireverse_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const refreshUnreadCount = () => fetchUnreadCount(user?.token);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      unreadCount,
      login,
      register,
      logout,
      updateProfile,
      handleFollowToggle,
      refreshUnreadCount,
      isAdmin: user?.accountType === 'admin',
      isCompany: user?.accountType === 'company',
      isProfessional: user?.accountType === 'professional',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
