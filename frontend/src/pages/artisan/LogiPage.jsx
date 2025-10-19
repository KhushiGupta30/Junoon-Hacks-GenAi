// --- MODIFIED FILE: LogiPage.jsx ---

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have this
import api from '../api/axiosConfig'; // Ensure you have this API instance

// --- (All sub-components like AnimatedSection, Icons, Header, Footer remain unchanged) ---
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
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const TruckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM5 11h3v4H5v-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-5h-5" /></svg>);
const GlobeAltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9a9 9 0 009 9m-9-9h18" /></svg>);
const CubeTransparentIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>);
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-google-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-google-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
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
    { name: 'Funding', href: '/artisan/grants' },
    { name: 'Logistics', href: '/artisan/logistics' },
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

// --- MAIN LOGISTICS PAGE COMPONENT ---
const LogisticsPage = () => {
  const { user, logout } = useAuth();
  const [logisticsData, setLogisticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Packaging tips can remain static on the frontend
  const packagingTips = [
      { title: "Use Double Boxing", description: "For fragile items, place a smaller box inside a larger one with cushioning in between." },
      { title: "Choose the Right Size", description: "A box that's too large increases shipping costs and the risk of damage." },
      { title: "Waterproof Your Items", description: "Wrap items in a plastic bag before boxing to protect against moisture." },
      { title: "Label Clearly", description: "Ensure the shipping label is secure, legible, and includes a return address." },
  ];

  useEffect(() => {
    const fetchLogisticsData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/logistics');
        setLogisticsData(response.data);
      } catch (err) {
        setError('Failed to load logistics information. Please try again later.');
        console.error("Fetch logistics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogisticsData();
  }, []);

  if (loading || !user || !logisticsData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Simplifying your shipping...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
            <p className="text-red-600 text-xl font-semibold">{error}</p>
            <p className="text-gray-600 mt-2">We're having trouble connecting to our services.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      <main className="pt-24 bg-white font-sans container mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <AnimatedSection>
            <div className="relative p-8 rounded-2xl shadow-xl mb-16 overflow-hidden text-white bg-google-red">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/topography.png')]"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8">
                    <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Logistics & <span className="text-google-yellow">Shipping Hub</span>
                        </h1>
                        <p className="text-lg max-w-lg mx-auto lg:mx-0 text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Streamline your deliveries with our trusted partners and expert tips.
                        </p>
                    </div>

                    <div className="flex-shrink-0 w-64 lg:w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center text-center" style={{ minHeight: '240px' }}>
                        <p className="text-sm font-semibold text-google-red uppercase tracking-wider mb-2">
                        Featured Partner
                        </p>
                        <img src={logisticsData.featuredPartner.logoUrl} alt={`${logisticsData.featuredPartner.name} Logo`} className="h-10 object-contain my-2" />
                        <p className="text-gray-600 text-sm mt-2">
                        {logisticsData.featuredPartner.summary}
                        </p>
                    </div>
                </div>
            </div>
        </AnimatedSection>

        {/* --- AI BEST FIT SUGGESTION --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-gray-50 p-8 rounded-2xl">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center">
              <SparklesIcon />
              <h2 className="text-3xl font-bold mt-4 text-gray-800">AI Best Fit Suggestion</h2>
              <p className="text-gray-600 mt-2 text-sm max-w-xs">Our smart recommendation for your specific shipping needs.</p>
            </div>
            <div className="w-full lg:w-8/12 bg-white p-6 rounded-2xl shadow-lg border">
              <p className="text-gray-600 font-medium">{logisticsData.bestFitSuggestion.scenario}</p>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img src={logisticsData.bestFitSuggestion.logo} alt="Partner Logo" className="h-8 object-contain self-start sm:self-center" />
                <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pl-0 sm:pl-6 pt-4 sm:pt-0">
                  <p className="font-bold text-lg text-google-blue">{logisticsData.bestFitSuggestion.partner}</p>
                  <p className="text-sm text-gray-700 mt-1">{logisticsData.bestFitSuggestion.reason}</p>
                  <p className="text-sm font-semibold text-google-green mt-2">{logisticsData.bestFitSuggestion.cost}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* --- DOMESTIC SHIPPING PARTNERS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-blue">
              <TruckIcon />
              <h2 className="text-3xl font-bold mt-4">Domestic Partners</h2>
              <p className="text-gray-600 mt-2 text-sm">Reliable delivery across India.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsData.domesticPartners.map((p) => (
                <div key={p._id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-shadow flex flex-col">
                  <img src={p.logoUrl} alt={p.name} className="h-8 object-contain self-start mb-3" />
                  <p className="text-sm text-gray-600 flex-grow">{p.summary}</p>
                  <div className="mt-4 border-t pt-3 space-y-2">
                    {p.strengths.map(s => <div key={s} className="flex items-center gap-2 text-sm"><CheckIcon /><span>{s}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- INTERNATIONAL SHIPPING PARTNERS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-green">
              <GlobeAltIcon />
              <h2 className="text-3xl font-bold mt-4">International Partners</h2>
              <p className="text-gray-600 mt-2 text-sm">Take your craft to the world.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsData.internationalPartners.map((p) => (
                <div key={p._id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-shadow flex flex-col">
                  <img src={p.logoUrl} alt={p.name} className="h-8 object-contain self-start mb-3" />
                  <p className="text-sm text-gray-600 flex-grow">{p.summary}</p>
                  <div className="mt-4 border-t pt-3 space-y-2">
                    {p.strengths.map(s => <div key={s} className="flex items-center gap-2 text-sm"><CheckIcon /><span>{s}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- PACKAGING TIPS --- */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center text-gray-500">
              <CubeTransparentIcon />
            </div>
            <h2 className="text-3xl font-bold mt-4">Essential Packaging Tips</h2>
            <p className="text-gray-600 mt-2 text-sm">Protect your creations during transit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packagingTips.map(tip => (
              <div key={tip.title} className="bg-gray-50/80 border border-gray-200/80 p-5 rounded-xl text-center hover:bg-white hover:shadow-lg transition-all">
                <h3 className="font-bold text-gray-800">{tip.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
};

export default LogisticsPage;