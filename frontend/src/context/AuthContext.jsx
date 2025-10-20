import React, { createContext, useState, useEffect, useContext } from "react";
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
  const navigate = useNavigate();

  // This useEffect now runs only once on initial component mount.
  // Its job is to re-authenticate a user if a token exists from a previous session.
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Token is invalid or expired. Logging out.", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    fetchUserOnLoad();
  }, []); // Empty dependency array means this runs only once.

  const handleAuthSuccess = (userData, idToken) => {
    localStorage.setItem("token", idToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
    setUser(userData);
    setToken(idToken); // Update token state

    // Navigate based on user role
    switch (userData.role) {
      case "artisan":
        navigate("/artisan/dashboard");
        break;
      case "ambassador":
        navigate("/ambassador/dashboard");
        break;
      default:
        navigate("/buyer");
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Manually set header for the immediate request
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      const response = await api.get("/auth/me");
      
      handleAuthSuccess(response.data, idToken);
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

      // Manually set header for the immediate request
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      const response = await api.post("/auth/register", { name, email, role });
      
      handleAuthSuccess(response.data.user, idToken);
      return response.data.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
    } catch (error) {
      console.error("Firebase sign out error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
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