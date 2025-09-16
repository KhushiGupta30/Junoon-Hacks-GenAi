import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You can replace this with a more sophisticated loading spinner component
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!isAuthenticated) {
        // If the user is not authenticated, redirect them to the home page.
        // We save the location they were trying to access in the state,
        // so we can redirect them back after they log in.
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    
    // If the route requires specific roles, check if the authenticated user's role is included.
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        // If the user doesn't have the required role, redirect them to a default page (e.g., the buyer marketplace).
        // This prevents a buyer from accessing an artisan's dashboard, for example.
        return <Navigate to="/buyer" replace />;
    }

    // If the user is authenticated and has the required role (or no role is required), render the component.
    return children;
};

export default ProtectedRoute;