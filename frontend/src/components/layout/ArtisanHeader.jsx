import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MenuIcon, XIcon, LogoutIcon } from '../common/Icons'; // Adjust path if needed

/**
 * A helper component to create the nav links.
 */
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === '/artisan/dashboard'} // Only end for the dashboard route
    className={({ isActive }) =>
      `flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
        isActive
          ? 'text-google-blue border-google-blue' // Active state
          : 'text-gray-600 border-transparent hover:text-google-blue' // Inactive state
      }`
    }
  >
    {children}
  </NavLink>
);

const ArtisanHeader = ({ user, logout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Nav links including "Orders" ---
  const navLinks = [
    { name: 'Dashboard', href: '/artisan/dashboard' },
    { name: 'Manage Products', href: '/artisan/products' },
    { name: 'Orders', href: '/artisan/orders' }, // <-- Added Orders link
    { name: 'New Idea', href: '/artisan/ideas/new' },
    { name: 'AI Trend Report', href: '/artisan/trends' },
    { name: 'Funding', href: '/artisan/grant' },
    { name: 'Community', href: '/artisan/community' },
    { name: 'Logistics', href: '/artisan/logistics' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-md border-b border-gray-200">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">

        {/* --- Left Side: Logo + Nav --- */}
        <div className="flex items-center h-16">
          <Link to="/artisan/dashboard" className="flex items-center space-x-3 mr-8">
            <img src="/logo.png" alt="KalaGhar Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tighter hidden sm:block">
              Kala<span className="text-google-blue">Ghar</span>
            </h1>
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden md:flex items-center h-16 space-x-7">
            {navLinks.map(link => (
              <NavItem key={link.name} to={link.href}>
                {link.name}
              </NavItem>
            ))}
          </nav>
        </div>

        {/* --- Right Side: Profile + Mobile Menu Button --- */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none">
              <img src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=0F9D58&color=fff`} alt="Profile" className="h-10 w-10 rounded-full border-2 border-google-blue/50" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down border border-gray-200">
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogoutIcon /> Logout
                </button>
              </div>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-700">
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* --- Mobile Menu (Updated with new links) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-5 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-google-blue">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}><XIcon /></button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  end={link.href === '/artisan/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-md font-medium ${isActive ? 'bg-google-blue/10 text-google-blue' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default ArtisanHeader;