// client/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider wraps the entire app — makes auth data available everywhere
export const AuthProvider = ({ children }) => {

  // Load user from localStorage so login persists on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('forenx_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Login: save user + token to state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('forenx_user', JSON.stringify(userData));
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem('forenx_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — any component can just call useAuth() to get user/login/logout
export const useAuth = () => useContext(AuthContext);
