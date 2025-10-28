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
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [token]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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
    
    await fetchNotifications(); 

    switch (userData.role) {
      case "artisan":
        navigate("/artisan/dashboard");
        break;
      case "ambassador":
        navigate("/ambassador/dashboard");
        break;
      case "investor":
        navigate("/investor/dashboard");
        break;
      default:
        navigate("/buyer/market");
        break;
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

  // --- START OF THE ONLY CHANGES ---

  const register = async (userData) => { // FIX 1: Accept one object 'userData'
    try {
      // FIX 2: Destructure the object to get all the variables
      const { name, email, password, role, state, city, language } = userData;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      
      // FIX 3: Send all the new fields to the backend
      const response = await api.post("/auth/register", { name, email, role, state, city, language });
      
      await handleAuthSuccess(response.data.user, idToken);
      return response.data.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // --- END OF THE ONLY CHANGES ---

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign out error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setNotifications([]);
      delete api.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    notifications,
    markNotificationAsRead,
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