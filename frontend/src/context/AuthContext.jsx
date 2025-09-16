import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user, token might be expired.", error);
                    // Clear invalid token from storage and state
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    delete api.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Redirect based on role after login
        if (userData.role === 'artisan') {
            navigate('/artisan/dashboard');
        } else {
            navigate('/buyer');
        }
    };

    const register = async (name, email, password, role) => {
        const response = await api.post('/auth/register', { name, email, password, role });
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Redirect based on role after registration
        if (userData.role === 'artisan') {
            navigate('/artisan/dashboard');
        } else {
            navigate('/buyer');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        navigate('/');
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

    // Render children only after the initial loading is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};