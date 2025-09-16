import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Link, NavLink } from 'react-router-dom';

// --- (Icon and AnimatedSection components remain unchanged) ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

const TrendingUpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> </svg> );
const SparklesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /> </svg> );
const ArchiveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> </svg> );
const GiftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /> </svg> );
const TagIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11a2 2 0 002 2h5a2 2 0 002-2V5a2 2 0 00-2-2H7z" /> </svg> );
const SupportIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /> </svg> );
const TruckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7.5a2.5 2.5 0 015 0V16a1 1 0 01-1 1h-2.5" /> </svg> );
const MicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m14 0a7 7 0 11-14 0m14 0v2a7 7 0 01-14 0v-2m14 0H5M19 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7 11a2 2 0 01-2-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 01-2 2h0z" /> </svg> );
const LightBulbIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> </svg> );
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);

// --- HEADER COMPONENT ---
const ArtisanHeader = ({ user, logout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/artisan/dashboard' },
    { name: 'My Products', href: '/artisan/products' },
    { name: 'Orders', href: '/artisan/orders' },
    { name: 'New Idea', href: '/artisan/ideas/new' },
  ];

  const activeLinkStyle = "text-google-blue border-b-2 border-google-blue pb-1";
  const inactiveLinkStyle = "hover:text-google-blue transition";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/artisan/dashboard" className="flex items-center space-x-3">
          <img src="/logo.png" alt="KalaGhar Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tighter">
            Kala<span className="text-google-blue">Ghar</span>
            <span className="text-lg font-medium text-gray-500 ml-3">Artisan Hub</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.href} className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none">
              <img src={user.profile?.avatar || 'https://placehold.co/100x100/4285F4/FFFFFF?text=A&font=roboto'} alt="Profile" className="h-10 w-10 rounded-full border-2 border-google-blue/50" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-google-blue">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}><XIcon /></button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <NavLink key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
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

// --- Footer Component ---
const Footer = () => (
  <footer className="bg-google-blue text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved.
      </div>
    </div>
  </footer>
);

// --- StatCard Component ---
const StatCard = ({ stat }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full border-l-8 ${stat.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${stat.bgColor}/10 ${stat.color}`}>{stat.icon}</div>
      <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
    </div>
    <div>
      <p className="text-3xl font-extrabold text-gray-800 mb-1">{stat.value}</p>
      <p className="text-sm text-gray-600">{stat.description}</p>
    </div>
  </div>
);

// --- Main Artisan Dashboard Component ---
const ArtisanDashboardPage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ orders: 0, lowInventory: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const ordersResponse = await api.get('/orders');
        const myProductsResponse = await api.get('/users/my-products');
        if (isMounted) {
          const activeOrders = ordersResponse.data.orders.filter(order => ['pending', 'confirmed', 'processing', 'in_production'].includes(order.status));
          const lowStockItems = myProductsResponse.data.products.filter(p => !p.inventory.isUnlimited && p.inventory.quantity < 5);
          setStats({ orders: activeOrders.length, lowInventory: lowStockItems.length });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const statsData = [
    { title: 'New Orders', value: stats.orders, icon: <ArchiveIcon />, color: 'text-google-blue', borderColor: 'border-google-blue', bgColor: 'bg-google-blue', link: '/artisan/orders', description: "View and manage incoming orders" },
    { title: 'Trending Craft', value: 'Block Printing', icon: <SparklesIcon />, color: 'text-google-green', borderColor: 'border-google-green', bgColor: 'bg-google-green', link: '#', description: "Discover high-demand art forms" },
    { title: 'Low Stock Alerts', value: `${stats.lowInventory} items`, icon: <TrendingUpIcon />, color: 'text-google-red', borderColor: 'border-google-red', bgColor: 'bg-google-red', link: '/artisan/products', description: "Replenish your popular items" },
  ];

  const featureCards = [
    { title: 'Manage Products', description: 'Add, edit, or remove your listings.', icon: <TagIcon />, imageUrl: 'https://placehold.co/400x200/F0F8FF/4285F4?text=Products&font=roboto&ts=28', link: '/artisan/products' },
    { title: 'Submit a New Idea', description: 'Get feedback from the community.', icon: <LightBulbIcon />, imageUrl: 'https://placehold.co/400x200/FFFAF0/F4B400?text=New+Idea&font=roboto&ts=28', link: '/artisan/ideas/new' },
    { title: 'AI Trend Reports', description: 'Insights, graphs, and tips.', icon: <TrendingUpIcon />, imageUrl: 'https://placehold.co/400x200/E8F0FE/DB4437?text=Trends&font=roboto&ts=28', link: '/artisan/trends' },
    { title: 'Grants & Investors', description: 'Find funding for your ideas.', icon: <GiftIcon />, imageUrl: 'https://placehold.co/400x200/F0FFF0/0F9D58?text=Funding&font=roboto&ts=28', link: '/artisan/grant' },
    { title: 'Community Support', description: 'Connect with fellow artisans.', icon: <SupportIcon />, imageUrl: 'https://placehold.co/400x200/FFF0F5/DB4437?text=Community&font=roboto&ts=28', link: '/artisan/community' },
    { title: 'Logistics Hub', description: 'Handle shipping with ease.', icon: <TruckIcon />, imageUrl: 'https://placehold.co/400x200/E6E6FA/4285F4?text=Logistics&font=roboto&ts=28', link: '/artisan/logistics' },
  ];

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="relative p-8 rounded-2xl shadow-xl mb-8 overflow-hidden text-white" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 z-0 opacity-20">
              <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern-circles-dash" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1.5" fill="#fff" opacity="0.1"></circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-circles-dash)"></rect>
              </svg>
            </div>
            <header className="relative z-10 flex justify-center items-center text-center">
              <div className="flex-grow">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                  <span className="text-google-yellow">Your</span> Creative <span className="text-white">Dashboard</span>
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Welcome back, {user.name}! Here's your workspace.
                </p>
              </div>
            </header>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) =>
              stat.link.startsWith('/') ?
                <Link key={index} to={stat.link} className="block"><StatCard stat={stat} /></Link> :
                <a key={index} href={stat.link} className="block cursor-pointer"><StatCard stat={stat} /></a>
            )}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, index) => (
            <AnimatedSection key={index}>
              <Link to={card.link} className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-60 flex flex-col justify-end p-6 text-white transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group card-bg-image border-2 border-transparent hover:border-google-blue" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%), url(${card.imageUrl})` }}>
                <div className="relative z-10">
                  <div className="mb-3 text-white">{card.icon}</div>
                  <h3 className="font-bold text-xl mb-1">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArtisanDashboardPage;