import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // To get logged-in user info
import api from '../api/axiosConfig'; // To make API calls

// --- Reusable Animated Section (No changes) ---
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
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

// --- Icon Components (No changes) ---
const TrendingUpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> </svg> );
const SparklesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /> </svg> );
const ArchiveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> </svg> );
const GiftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /> </svg> );
const TagIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11a2 2 0 002 2h5a2 2 0 002-2V5a2 2 0 00-2-2H7z" /> </svg> );
const SupportIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /> </svg> );
const CalendarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg> );
const TruckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7.5a2.5 2.5 0 015 0V16a1 1 0 01-1 1h-2.5" /> </svg> );
const BellIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg> );
const MicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m14 0a7 7 0 11-14 0m14 0v2a7 7 0 01-14 0v-2m14 0H5M19 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7 11a2 2 0 01-2-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 01-2 2h0z" /> </svg> );

// --- Footer Component (No changes) ---
const Footer = () => (
    <footer className="bg-google-blue text-white py-6 mt-12">
        <div className="container mx-auto text-center text-sm text-white/80">
            &copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved.
        </div>
    </footer>
);


// --- Main Artisan Dashboard Component ---
const ArtisanDashboardPage = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [stats, setStats] = useState({
    orders: 0,
    lowInventory: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch orders for the current artisan
        const ordersResponse = await api.get('/orders');
        const myProductsResponse = await api.get('/users/my-products');

        // Example logic: Count pending/processing orders
        const activeOrders = ordersResponse.data.orders.filter(
            order => ['pending', 'confirmed', 'processing', 'in_production'].includes(order.status)
        );

        // Example logic: Count items with low inventory (e.g., quantity < 5)
        const lowStockItems = myProductsResponse.data.products.filter(
            p => !p.inventory.isUnlimited && p.inventory.quantity < 5
        );

        setStats({
          orders: activeOrders.length,
          lowInventory: lowStockItems.length,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { title: 'Current Orders', value: stats.orders, icon: <ArchiveIcon />, color: 'text-google-blue', borderColor: 'border-google-blue', bgColor: 'bg-google-blue'},
    { title: 'New Trend Alert', value: 'Indigo Dyes', icon: <SparklesIcon />, color: 'text-google-red', borderColor: 'border-google-red', bgColor: 'bg-google-red'},
    { title: 'Inventory Status', value: `${stats.lowInventory} items low`, icon: <TrendingUpIcon />, color: 'text-google-yellow', borderColor: 'border-google-yellow', bgColor: 'bg-google-yellow'},
  ];

  const featureCards = [
      { title: 'AI Trend Reports', description: 'Insights, graphs, and tips.', icon: <TrendingUpIcon />, imageUrl: 'https://placehold.co/400x200/E8F0FE/4285F4?text=Trends&ts=28' },
      { title: 'Grants & Investors', description: 'Find funding for your ideas.', icon: <GiftIcon />, imageUrl: 'https://placehold.co/400x200/FFF0C7/F4B400?text=Funding&ts=28' },
      { title: 'Manage Products', description: 'Automated, voice-based pages.', icon: <TagIcon />, imageUrl: 'https://placehold.co/400x200/E6F4EA/0F9D58?text=Products&ts=28' },
      { title: 'Community Support', description: 'Connect with fellow artisans.', icon: <SupportIcon />, imageUrl: 'https://placehold.co/400x200/FCE8E6/DB4437?text=Community&ts=28' },
      { title: 'Events & Sales', description: 'Manage QR codes and pop-ups.', icon: <CalendarIcon />, imageUrl: 'https://placehold.co/400x200/F3E8FD/8E24AA?text=Events&ts=28' },
      { title: 'Logistics Hub', description: 'Handle shipping with ease.', icon: <TruckIcon />, imageUrl: 'https://placehold.co/400x200/F1F3F4/5F6368?text=Logistics&ts=28' },
  ];

  if (loading || !user) {
    return <div>Loading Dashboard...</div>; // Or a loading spinner
  }

  return (
    <>
      {/* CSS Styles (No changes) */}
      <style>{`
        .bg-google-blue { background-color: #4285F4; } .text-google-blue { color: #4285F4; } .border-google-blue { border-color: #4285F4; }
        .bg-google-red { background-color: #DB4437; } .text-google-red { color: #DB4437; } .border-google-red { border-color: #DB4437; }
        .bg-google-yellow { background-color: #F4B400; } .text-google-yellow { color: #F4B400; } .border-google-yellow { border-color: #F4B400; }
        .bg-google-green { background-color: #0F9D58; } .text-google-green { color: #0F9D58; } .border-google-green { border-color: #0F9D58; }
        .bg-gradient-yellow-deep { background-image: linear-gradient(to right, #F4B400, #F29900); }
        .bg-gradient-blue-light { background-image: linear-gradient(to right, #4285F4, #5A95F5); }
        .main-bg { background-color: #f8f9fa; }
        .pulsate { animation: pulsate-animation 1.5s infinite; }
        @keyframes pulsate-animation { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
        .card-bg-image { background-size: cover; background-position: center; }
      `}</style>
      
      <div className="main-bg min-h-screen font-sans flex flex-col justify-between">
        <div>
            <div className="container mx-auto p-4 md:p-8">
            
            {/* --- Header --- */}
            <AnimatedSection>
                <div className="relative bg-gray-200 p-8 rounded-2xl shadow-sm mb-8 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
                            <defs> <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse"> <circle id="pattern-circle" cx="20" cy="20" r="2" fill="#000" opacity="0.1"></circle> </pattern> </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                            <path d="M-50 0 C 80 0, 150 150, 300 150 L 0 150 Z" fill="#0F9D58" opacity="0.5"></path>
                            <path d="M 0 0 C 100 50, 50 150, 200 150 L 0 150 Z" fill="#4285F4" opacity="0.6"></path>
                            <path d="M850 0 C 720 0, 650 150, 500 150 L 800 150 Z" fill="#DB4437" opacity="0.5"></path>
                            <path d="M 800 0 C 700 50, 750 150, 600 150 L 800 150 Z" fill="#F4B400" opacity="0.6"></path>
                        </svg>
                    </div>

                    <header className="relative z-10 flex justify-between items-center">
                        <div className="flex-grow text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                                <span className="text-google-blue">Your</span> Creative <span className="text-google-yellow">Dashboard</span>
                            </h1>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto" style={{textShadow: '0 1px 3px rgba(0,0,0,0.2)'}}>
                                Welcome back, {user.name}. Here's your workspace.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 rounded-full text-white/80 hover:bg-black/20 transition-colors duration-300">
                                <BellIcon />
                                <span className="absolute top-0 right-0 h-3 w-3 bg-google-red rounded-full border-2 border-gray-200"></span>
                            </button>
                            <img src={user.profile?.avatar || 'https://placehold.co/100x100/F4B400/333333?text=A'} alt="Profile" className="h-14 w-14 rounded-full border-4 border-white/50 shadow-sm"/>
                        </div>
                    </header>
                </div>
            </AnimatedSection>

            {/* --- Quick Stats --- */}
            <AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-8 ${stat.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl`}
                    >
                    <div className={`p-3 rounded-full ${stat.bgColor}/10 ${stat.color}`}>{stat.icon}</div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    </div>
                ))}
                </div>
            </AnimatedSection>
            
            {/* --- Main Actions Grid (No data changes needed here) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureCards.map((card, index) => (
                <AnimatedSection key={index}>
                    <div 
                        onClick={() => setSelectedCard(card.title)}
                        className={`relative bg-white rounded-2xl shadow-lg overflow-hidden h-56 flex flex-col justify-end p-6 text-white transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group card-bg-image border-2 ${selectedCard === card.title ? 'border-google-yellow' : 'border-transparent'}`}
                        style={{backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%), url(${card.imageUrl})`}}
                    >
                        <div className="relative z-10">
                            <div className={`mb-2 text-white`}>{card.icon}</div>
                            <h3 className="font-bold text-xl mb-1">{card.title}</h3>
                            <p className="text-sm opacity-90">{card.description}</p>
                        </div>
                    </div>
                </AnimatedSection>
                ))}
                <AnimatedSection className="lg:col-span-2">
                    <div className="relative bg-gradient-yellow-deep text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between h-full transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 text-black/10"> <GiftIcon/> </div>
                        <div className="relative z-10">
                            <h3 className="font-extrabold text-2xl mb-2">Need Funding?</h3>
                            <p className="mb-4 md:mb-0">Apply for grants and micro-loans to fuel your creativity.</p>
                        </div>
                        <button className="relative z-10 bg-white text-google-yellow font-bold px-6 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap">
                            Explore Grants
                        </button>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <div className="relative bg-gradient-blue-light text-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center h-full transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                        <div className="absolute -top-8 -left-8 w-32 h-32 text-black/10"> <MicIcon/> </div>
                        <div className="relative z-10 flex flex-col items-center">
                        <div className="p-4 rounded-full bg-white/20 pulsate mb-3"> <MicIcon /> </div>
                        <h3 className="font-bold text-2xl mb-2">Voice Assistant</h3>
                        <p className="text-sm mb-4 opacity-90">"Which products are in high demand?"</p>
                        <button className="bg-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/40 transition-all duration-300 transform hover:scale-105 w-full">
                            Tap to Ask
                        </button>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
            </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ArtisanDashboardPage;