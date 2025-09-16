import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api/axiosConfig';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- (AnimatedSection and Icon components remain unchanged) ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- (Icons, Header, and Footer components remain unchanged) ---
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-google-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.516l.153-.352c.2-.463.6-.78 1.084-.78h.548c.552 0 1 .448 1 1v13.586a1 1 0 01-1.707.707l-3.585-3.585A4.008 4.008 0 0113 13H5.436z" />
    </svg>
);

const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);

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

const Footer = () => (
  <footer className="bg-google-blue text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved.
      </div>
    </div>
  </footer>
);

// --- Chart Components ---
const CategoryChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Demand by Category (%)',
            data: data.data,
            backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
            borderRadius: 5,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Trending Product Categories', font: { size: 16 } },
        },
        scales: { y: { beginAtZero: true } }
    };
    return <Bar options={options} data={chartData} />;
};

const TrendingMaterialsChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Popularity',
            data: data.data,
            backgroundColor: ['#0F9D58', '#DB4437', '#4285F4', '#F4B400'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Trending Craft Materials', font: { size: 16 } },
        }
    };
    return <Doughnut data={chartData} options={options} />;
};

// --- Main AI Trends Page ---
const AITrendsPage = () => {
  const { user, logout } = useAuth();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await api.get('/ai/trends');
        setTrends(response.data);
      } catch (err) {
        setError("Failed to load AI trends. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Analyzing Latest Trends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <AnimatedSection>
          <div
            className="relative p-8 rounded-2xl shadow-xl mb-12 overflow-hidden text-white bg-google-blue"
          >
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
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  AI-Powered <span className="text-google-yellow">Trend Hub</span>
                </h1>
                <p className="text-lg max-w-lg mx-auto lg:mx-0 text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Stay ahead of the curve with AI-driven insights to grow your craft business.
                </p>
              </div>
              <div className="flex-shrink-0 w-64 lg:w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center">
                <div className="flex items-center justify-center mb-4">
                  <SparklesIcon />
                </div>
                <p className="text-sm font-semibold text-google-blue uppercase tracking-wider text-center mb-2">
                  Trend of the Month
                </p>
                <h3 className="text-lg font-bold text-gray-800 text-center">{trends.trendOfMonth.title}</h3>
                <p className="text-gray-600 text-sm mt-2 text-center">{trends.trendOfMonth.summary}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {trends.trendOfMonth.keywords.map((kw, idx) => (
                    <span key={idx} className="text-xs font-medium bg-gray-200/80 text-gray-800 px-2 py-1 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* AI Recommendations Section */}
        <AnimatedSection className="mb-12 flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-green">
              <MegaphoneIcon />
              <h2 className="text-3xl font-bold mt-4">AI-Driven Recommendations</h2>
              <p className="text-gray-600 mt-2 text-sm">Actionable tips to help you succeed.</p>
          </div>
          <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.actionableTips.map((tip, idx) => (
              <div key={idx} className="relative bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-transform transform hover:-translate-y-1">
                <div className="absolute -top-3 -right-3 text-google-green opacity-20">
                  <LightBulbIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Graphs Section */}
        <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MODIFICATION: Added flex classes to center the chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-center items-center">
            <CategoryChart data={trends.categoryDemand} />
          </div>
          {/* MODIFICATION: Added flex classes to center the chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-center items-center">
            <TrendingMaterialsChart data={trends.trendingMaterials} />
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
};

export default AITrendsPage;