import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user, token might be expired.", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      localStorage.setItem("token", idToken);
      setToken(idToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      const response = await api.get("/auth/me");
      const userData = response.data;
      setUser(userData);

      // Navigate based on user role
      if (userData.role === "artisan") {
        navigate("/artisan/dashboard");
      } else if (userData.role === "ambassador") {
        navigate("/ambassador/dashboard");
      } else {
        navigate("/buyer");
      }
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      // First create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Set token for the registration API call
      localStorage.setItem("token", idToken);
      setToken(idToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      // Register user in backend
      const response = await api.post("/auth/register", { 
        name, 
        email, 
        role 
      });
      
      const userData = response.data.user;
      setUser(userData);

      // Navigate based on user role
      if (userData.role === "artisan") {
        navigate("/artisan/dashboard");
      } else if (userData.role === "ambassador") {
        navigate("/ambassador/dashboard");
      } else {
        navigate("/buyer");
      }
      
      return userData;
    } catch (error) {
      console.error("Registration error:", error);
      // If backend registration fails, we might want to delete the Firebase user
      // But for now, just throw the error
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if needed
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
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
      {children}
    </AuthContext.Provider>
  );
};