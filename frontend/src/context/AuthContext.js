import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('veriqo_token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('veriqo_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('veriqo_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('veriqo_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const processGoogleAuth = async (sessionId) => {
    const response = await axios.post(`${API_URL}/auth/google/session`, { session_id: sessionId });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('veriqo_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const sendPhoneOTP = async (phoneNumber) => {
    const response = await axios.post(`${API_URL}/auth/phone/send-otp`, { phone_number: phoneNumber });
    return response.data;
  };

  const loginWithPhone = async (phoneNumber, code) => {
    const response = await axios.post(`${API_URL}/auth/phone/verify-otp`, { 
      phone_number: phoneNumber, 
      code 
    });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('veriqo_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('veriqo_token');
    setToken(null);
    setUser(null);
    // Also call backend logout to clear cookie
    axios.post(`${API_URL}/auth/logout`).catch(() => {});
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser();
    }
  };

  const completeOnboarding = async () => {
    try {
      await axios.put(`${API_URL}/auth/complete-onboarding`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, onboarding_completed: true }));
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      processGoogleAuth,
      sendPhoneOTP,
      loginWithPhone,
      logout,
      refreshUser,
      completeOnboarding
    }}>
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
