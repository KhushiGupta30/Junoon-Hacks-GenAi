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
  return useContext(AuthContext);
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

    if (userData.role === "artisan") {
      navigate("/artisan/dashboard");
    } else {
      navigate("/buyer");
    }
  };

  const register = async (name, email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    localStorage.setItem("token", idToken);
    setToken(idToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

    const response = await api.post("/auth/register", { name, email, role });
    const userData = response.data;
    setUser(userData);

    if (userData.role === "artisan") {
      navigate("/artisan/dashboard");
    } else {
      navigate("/buyer");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
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
