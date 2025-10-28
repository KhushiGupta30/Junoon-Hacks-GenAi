import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // 1. Import useCart
import { motion, AnimatePresence } from 'framer-motion'; // 2. Import Framer Motion
import {
  LogOut,
  User,
  Bell,
  Search, // 3. Import Lucide-react Search
} from 'lucide-react';

// 4. Define CartIcon locally (copied from BuyerMarketplace)
const CartIcon = () => {
    const { cartCount } = useCart(); // Get count from context
    return (
        <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" ></path> </svg>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-google-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </div>
    );
};

// 5. Define Dropdown Animation Variants
const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "tween", duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { type: "tween", duration: 0.1, ease: "easeIn" } }
};

const BuyerHeader = () => {
  const { user, logout, notifications, markNotificationAsRead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // 6. Check for unread notifications (assuming 'user' can be null)
  const unreadCount = user ? notifications.filter(n => !n.isRead).length : 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
        markNotificationAsRead(notification.id);
    }
    setIsNotifOpen(false);
    if(notification.link) navigate(notification.link);
  };

  // 7. Handle scroll-to-hash links for on-page navigation
  const handleHashLink = (e, hash) => {
    e.preventDefault();
    // If we're already on the /market page, just scroll
    if (location.pathname === '/buyer/market') {
      const el = document.getElementById(hash.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not, navigate to the market page with the hash
      navigate(hash);
    }
  };

  // 8. Conditionally render profile/login
  const renderProfileControls = () => {
    if (!user) {
      return (
        <Link 
          to="/buyer/market" // Or your specific login trigger
          onClick={() => { /* In your setup, Header onLoginClick triggers this, so this might be redundant or handled by App.jsx */ }}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-google-blue"
        >
          <User size={20} className="mr-1" />
          Sign In
        </Link>
      );
    }

    return (
      <>
        {/* --- Notification Bell --- */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-gray-100 transition relative">
            <Bell className="h-6 w-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full text-white flex items-center justify-center text-[8px]">{unreadCount}</span>
            )}
          </button>
          <AnimatePresence>
            {isNotifOpen && (
                <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-[60] border border-gray-200"
                >
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">Notifications</h3>
                <ul className="flex flex-col max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((notif) => (
                    <li key={notif.id} onClick={() => handleNotificationClick(notif)} className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${!notif.isRead ? 'bg-blue-50' : ''}`}>
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
                    </li>
                  )) : (
                    <li className="p-4 text-center text-sm text-gray-500">You have no new notifications.</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Profile Dropdown --- */}
        <div className="relative" ref={profileRef}>
          <div className={`p-0.5 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow transition-all duration-300 ${isProfileOpen ? 'animate-pulse' : ''}`}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="block rounded-full focus:outline-none bg-white p-px">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-google-blue">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>
          </div>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60] border border-gray-200"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex flex-col space-y-1 mt-1 px-1">
                  <NavLink to="/buyer/profile" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsProfileOpen(false)}>
                    <User size={16} className="mr-2" /> My Profile
                  </NavLink>
                  {/* You can add a /buyer/orders link here */}
                  <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut size={16} className="mr-2" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };


  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-200">
      <div className="w-full h-16 px-4 sm:px-6 md:px-8">

        <div className="h-full flex items-center justify-between">

          <div className="flex items-center justify-start flex-1 h-full">
            <Link to="/buyer/market" className="flex items-center space-x-3 mr-8 flex-shrink-0">
              <img src="/logo.png" alt="KalaGhar Logo" className="h-10 w-10 object-contain" />
              <h1 className="text-3xl font-bold text-gray-800 tracking-tighter hidden sm:block">
                कला<span className="text-google-blue">Ghar</span>
              </h1>
            </Link>

          </div>

          <div className="flex items-center justify-center flex-1 h-full">
            {/* 9. Use original Buyer nav links, handling hash links */}
            <nav className="hidden md:flex items-center h-16 space-x-7">
                <Link 
                    to="/buyer/market" 
                    className={`flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
                        location.pathname === '/buyer/market' && location.hash === '' 
                        ? 'text-google-blue border-google-blue' 
                        : 'text-gray-600 border-transparent hover:text-google-blue'
                    }`}
                >
                    Shop
                </Link>
                <Link 
                    to="/buyer/new-ideas" 
                    onClick={(e) => handleHashLink(e, '#new-ideas')}
                    className={`flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
                        location.hash === '#new-ideas' 
                        ? 'text-google-blue border-google-blue' 
                        : 'text-gray-600 border-transparent hover:text-google-blue'
                    }`}
                >
                    New Ideas
                </Link>
                 <Link 
                    to="/buyer/our-artisans" 
                    onClick={(e) => handleHashLink(e, '#artisans')}
                    className={`flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
                        location.hash === '#artisans' 
                        ? 'text-google-blue border-google-blue' 
                        : 'text-gray-600 border-transparent hover:text-google-blue'
                    }`}
                >
                    Our Artisans
                </Link>
            </nav>
          </div>



          {/* 10. Add Search and Cart icons */}
          <div className="flex items-center justify-end flex-1 h-full">
            <div className="flex items-center space-x-4 flex-shrink-0">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Search className="h-6 w-6 text-gray-700" />
            </button>
            <Link to="/buyer/cart" className="p-2 rounded-full hover:bg-gray-100 transition">
              <CartIcon />
            </Link>
            
            {/* Renders Login button or Profile Dropdown */}
            {renderProfileControls()} 
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default BuyerHeader;