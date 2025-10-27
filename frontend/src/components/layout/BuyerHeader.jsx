import React, { useState, useEffect, useRef } from 'react';
// Imports from lucide-react are assumed to be available
import {
  LogOut,
  User,
  Bell,
} from 'lucide-react';

// --- MOCKED DEPENDENCIES to resolve build error ---
// These are included to ensure the component can be rendered in a standalone environment.
// In a real application, you would remove these and use actual react-router-dom and AuthContext.

const useLocation = () => ({ pathname: '/market' }); // Default active path for 'Shop'

const useNavigate = () => (path) => {
  console.log(`Mock navigation to: ${path}`);
};

const Link = ({ to, children, ...props }) => (
  <a href={to} {...props} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

const NavLink = ({ to, children, className: classNameProp, end }) => {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  const className = typeof classNameProp === 'function'
    ? classNameProp({ isActive })
    : classNameProp;

  return (
    <a href={to} className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
};

const useAuth = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your order has shipped!', createdAt: new Date(Date.now() - 3600000).toISOString(), isRead: false, link: '/market/orders/1' },
    { id: 2, message: 'Welcome to KalaGhar!', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true, link: '/market' },
  ]);

  return {
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
    logout: () => console.log('User logged out.'),
    notifications: notifications,
    markNotificationAsRead: (id) => {
      console.log(`Marking notification ${id} as read.`);
      setNotifications(notifs =>
        notifs.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    },
  };
};

// --- ORIGINAL COMPONENT CODE (with 'App' as main component) ---

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    // 'end' prop is important for exact matching of the 'Shop' root path
    end={to === '/market'}
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

const App = () => {
  const { user, logout, notifications, markNotificationAsRead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  // --- UPDATED NAVIGATION LINKS as per the image ---
  const navLinks = [
    { name: 'Shop', href: '/market' },          // Corresponds to 'Marketplace' or general shop
    { name: 'New Ideas', href: '/market/ideas' }, // New link for ideas
    { name: 'Our Artisans', href: '/market/artisans' }, // Existing link
  ];

  return (
    <div className=""> {/* Removed classes: "pt-16 min-h-screen bg-gray-50" */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-200">
        <div className="w-full">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
            {/* Left Section: Logo */}
            <div className="flex items-center h-16 flex-shrink-0">
              <Link to="/market" className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-google-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                  K
                </div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tighter hidden sm:block">
                  कला<span className="text-google-blue">Ghar</span>
                </h1>
              </Link>
            </div>

            {/* Center Section: Navigation Links */}
            <nav className="hidden md:flex items-center h-16 space-x-7">
              {navLinks.map((link) => <NavItem key={link.name} to={link.href}>{link.name}</NavItem>)}
            </nav>

            {/* Shopping cart, search, and user profile icons on the right */}
            <div className="flex items-center space-x-4 flex-shrink-0">
                {/* Search Icon */}
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-6 w-6 text-gray-700"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
                {/* Shopping Cart Icon */}
                <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart h-6 w-6 text-gray-700"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    {/* Optionally add a cart item count here if needed, similar to unread notifications */}
                    {/* <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full text-white flex items-center justify-center text-[8px]">3</span> */}
                </button>

                {/* Notification Bell (kept for consistency with ArtisanHeader) */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-gray-100 transition relative">
                  <Bell className="h-6 w-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full text-white flex items-center justify-center text-[8px]">{unreadCount}</span>
                  )}
                </button>
                {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-[60] border border-gray-200">
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
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <div className={`p-0.5 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow transition-all duration-300 ${isProfileOpen ? 'animate-pulse' : ''}`}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="block rounded-full focus:outline-none bg-white p-px">
                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-google-blue">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
                      <NavLink to="/market/profile" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsProfileOpen(false)}>
                        <User size={16} className="mr-2" /> My Profile
                      </NavLink>
                      <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
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

      {/* Removed the <main> block containing the sample text */}
    </div>
  );
};

export default App;

