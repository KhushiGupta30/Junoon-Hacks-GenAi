import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]); // <-- NEW STATE
  const navigate = useNavigate();

  // --- NEW: Function to fetch notifications ---
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [token]);

  // --- NEW: Function to mark a notification as read ---
  const markNotificationAsRead = useCallback(async (notificationId) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optional: revert state on error
      fetchNotifications();
    }
  }, [fetchNotifications]);


  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
          // Fetch notifications after user is confirmed
          await fetchNotifications(); 
        } catch (error) {
          console.error("Token is invalid or expired. Logging out.", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setNotifications([]);
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    fetchUserOnLoad();
  }, [token, fetchNotifications]);

  const handleAuthSuccess = async (userData, idToken) => {
    localStorage.setItem("token", idToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
    setUser(userData);
    setToken(idToken);
    
    // Fetch initial notifications on login/register
    await fetchNotifications(); 

    switch (userData.role) {
      case "artisan": navigate("/artisan/dashboard"); break;
      case "ambassador": navigate("/ambassador/dashboard"); break;
      default: navigate("/buyer");
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      const response = await api.get("/auth/me");
      
      await handleAuthSuccess(response.data, idToken);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      const response = await api.post("/auth/register", { name, email, role });
      
      await handleAuthSuccess(response.data.user, idToken);
      return response.data.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign out error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setNotifications([]); // Clear notifications on logout
      delete api.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    notifications, // <-- EXPOSE NOTIFICATIONS
    markNotificationAsRead, // <-- EXPOSE FUNCTION
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
