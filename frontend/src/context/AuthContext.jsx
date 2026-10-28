import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, profileApi } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check existing session by calling GET /profile on startup
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await profileApi.getProfile();
      if (res && res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      // 401 Unauthorized or network error -> treat as logged out
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    setError(null);
    const res = await authApi.login(credentials);
    if (res && res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    const res = await authApi.register(userData);
    if (res && res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  // Synchronize local user state when profile is edited
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshProfile: checkAuth,
        isAuthenticated: !!user,
      }}
    >
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

export default AuthContext;
