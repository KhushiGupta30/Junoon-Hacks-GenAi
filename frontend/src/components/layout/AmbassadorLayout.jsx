import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Users, MessageSquare, LayoutDashboard } from 'lucide-react';

const AmbassadorHeader = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinkClasses = "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClass = "text-white bg-gray-800";
    const inactiveClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
                {/* Corrected padding here to match Artisan Dashboard */}
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="KalaGhar Logo" className="h-8 w-auto" />
                        <span className="text-xl font-semibold text-gray-800">Ambassador Hub</span>
                    </div>
                    <nav className="flex items-center gap-2">
                        <NavLink to="/ambassador/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><LayoutDashboard size={16} className="mr-2" />Dashboard</NavLink>
                        <NavLink to="/ambassador/artisans" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><Users size={16} className="mr-2" />My Artisans</NavLink>
                        <NavLink to="/ambassador/community" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><MessageSquare size={16} className="mr-2" />Community Hub</NavLink>
                        <NavLink to="/ambassador/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><User size={16} className="mr-2" />Profile</NavLink>
                        <button onClick={handleLogout} className={`${inactiveClass} ${navLinkClasses} ml-4`}>
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

const AmbassadorLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AmbassadorHeader />
            <main className="p-8">
                <Outlet /> {/* This will render the active nested route */}
            </main>
        </div>
    );
};

export default AmbassadorLayout;