import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// const backendUrl = "https://imagesearch-4g8h.onrender.com";

const backendUrl = process.env.NODE_ENV === 'production'
  ? "https://imagesearch-4g8h.onrender.com" // Your live backend
  : "http://localhost:5000"; // Your local backend

// const backendUrl = "https://imagesearch-4g8h.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To show a loading screen

  // This function checks if you are already logged in (from a cookie)
  // when the app first loads.
  const checkAuthStatus = async () => {
    try {
      // We'll create this /api/me endpoint on the backend
      const res = await axios.get(`${backendUrl}/api/me`, { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // Runs only once when the app starts

  // The REAL logout function
  const logout = async () => {
    try {
      // We'll create this /auth/logout endpoint on the backend
      await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
      setUser(null); // Clear the user in React
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  if (loading) {
    return <div>Loading app...</div>; // Or a real loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, backendUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a custom hook to easily get the auth state
export const useAuth = () => {
  return useContext(AuthContext);

};


