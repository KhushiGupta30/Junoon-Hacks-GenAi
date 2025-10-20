import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  User,
  Users,
  MessageSquare,
  LayoutDashboard,
  Bell,
} from 'lucide-react';

// Reusable NavItem component to ensure identical styling with ArtisanHeader
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to.endsWith('dashboard')}
    className={({ isActive }) =>
      `flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
        isActive
          ? 'text-google-blue border-google-blue'
          : 'text-gray-600 border-transparent hover:text-google-blue'
      }`
    }
  >
    {children}
  </NavLink>
);

const AmbassadorHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Define the navigation links for the Ambassador Hub
  const navLinks = [
    { name: 'Dashboard', href: '/ambassador/dashboard' },
    { name: 'My Artisans', href: '/ambassador/artisans' },
    { name: 'Community Hub', href: '/ambassador/community' },
  ];

  // Mock notifications to match the design
  const notifications = [
    { id: 1, text: 'New artisan application received', time: '1h ago' },
    { id: 2, text: 'Community event "Art Fair" is next week', time: '3h ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-200">
      <div className="w-full">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
          {/* --- Left: Logo + Nav --- */}
          <div className="flex items-center h-16">
            <Link
              to="/ambassador/dashboard"
              className="flex items-center space-x-3 mr-8 flex-shrink-0"
            >
              <img
                src="/logo.png"
                alt="KalaGhar Logo"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-800 tracking-tighter hidden sm:block">
                कला<span className="text-google-blue">Ghar</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center h-16 space-x-7">
              {navLinks.map((link) => (
                <NavItem key={link.name} to={link.href}>
                  {link.name}
                </NavItem>
              ))}
            </nav>
          </div>

          {/* --- Right: Notifications + Profile --- */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
              >
                <Bell className="h-6 w-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {isNotifOpen && (
                 <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-[60] border border-gray-200">
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
                    Notifications
                  </h3>
                  <ul className="flex flex-col">
                    {notifications.map((notif) => (
                      <li key={notif.id} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
                        <p>{notif.text}</p>
                        <span className="text-xs text-gray-400">{notif.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div
                className={`p-0.5 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow transition-all duration-300 ${isProfileOpen ? 'animate-pulse' : ''}`}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="block rounded-full focus:outline-none bg-white p-px"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-google-blue">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                </button>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60] border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  <div className="flex flex-col space-y-1 mt-1 px-1">
                    <NavLink
                        to="/ambassador/profile"
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsProfileOpen(false)}
                    >
                        <User size={16} className="mr-2" /> My Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={16} className="mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const AmbassadorLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AmbassadorHeader />
            <main className="pt-16"> {/* Add padding-top to avoid content hiding under fixed header */}
                 <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                 </div>
            </main>
        </div>
    );
};

export default AmbassadorLayout;