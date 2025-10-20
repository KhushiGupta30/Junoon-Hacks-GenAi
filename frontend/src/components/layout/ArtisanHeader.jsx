import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MenuIcon, LogoutIcon, BellIcon } from '../common/Icons'; // Added BellIcon

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === '/artisan/dashboard'}
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

const ArtisanHeader = ({ user, logout }) => {
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

  const navLinks = [
    { name: 'Dashboard', href: '/artisan/dashboard' },
    { name: 'Manage Products', href: '/artisan/products' },
    { name: 'Orders', href: '/artisan/orders' },
    { name: 'New Idea', href: '/artisan/ideas/new' },
    { name: 'My Reviews', href: '/artisan/reviews' },
    { name: 'AI Trend Report', href: '/artisan/trends' },
    { name: 'Funding', href: '/artisan/grants' },
    
    { name: 'Logistics', href: '/artisan/logistics' },
    { name: 'Community', href: '/artisan/community' },
  ];

  const notifications = [
    { id: 1, text: 'Your product has been approved', time: '2h ago' },
    { id: 2, text: 'New funding opportunity available', time: '5h ago' },
    { id: 3, text: 'AI Trend report updated', time: '1d ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-200">
      {/* ✅ Removed container spacing */}
      <div className="w-full">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
          {/* --- Left: Logo + Nav --- */}
          <div className="flex items-center h-16">
            <Link
              to="/artisan/dashboard"
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

            <nav className="hidden md:flex items-center h-16 space-x-7 overflow-x-auto scrollbar-hide">
              {navLinks.map((link) => (
                <NavItem key={link.name} to={link.href}>
                  {link.name}
                </NavItem>
              ))}
            </nav>
          </div>

          {/* --- Right: Notifications + Profile + Mobile Menu --- */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition relative"
              >
                <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl py-2 z-[60] border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                    Notifications
                  </h3>
                  <ul className="flex flex-col">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <p>{notif.text}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {notif.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-2">
                    <button className="text-sm text-google-blue hover:underline">
                      See all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <div
                className={`p-0.5 rounded-full bg-[conic-gradient(from_0deg,#4285F4,#DB4437,#F4B400,#0F9D58,#4285F4)] 
                transition-all duration-200 
                ${isProfileOpen ? 'animate-google-spin' : 'hover:animate-google-spin'}`}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="block rounded-full focus:outline-none bg-white p-px dark:bg-slate-900"
                >
                  <img
                    src={
                      user.profile?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=0F9D58&color=fff`
                    }
                    alt="Profile"
                    className="h-9 w-9 rounded-full block border-2 border-white dark:border-slate-900"
                  />
                </button>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl py-4 z-[60] border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex flex-col items-center px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={
                        user.profile?.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=4285F4&color=fff`
                      }
                      alt="Profile"
                      className="h-16 w-16 rounded-full border-4 border-white shadow-md"
                    />
                    <p className="mt-2 font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      Hi, {user.name?.split(' ')[0] || 'User'}!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>

                    <Link 
                      to="/artisan/ArtisanProfilePage" // This links to your ArtisanProfilePage
                      onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                      className="mt-3 px-4 py-1.5 text-sm font-medium text-google-blue border border-gray-300 rounded-full hover:bg-google-blue/10 transition duration-150"
                    >
                      Manage your Account
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-1 mt-2 px-2">
                    <button className="flex items-center justify-center w-full py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      + Add account
                    </button>
                    <button
                      onClick={logout}
                      className="flex items-center justify-center w-full py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg"
                    >
                      <LogoutIcon /> Sign out
                    </button>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-4 flex justify-center gap-2">
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                    •
                    <a href="#" className="hover:underline">
                      Terms of Service
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                /* Logic to open mobile menu */
              }}
              className="md:hidden text-gray-700"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArtisanHeader;
