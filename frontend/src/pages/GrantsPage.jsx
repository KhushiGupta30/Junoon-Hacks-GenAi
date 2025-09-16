import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

// --- MOCK AUTH CONTEXT ---
// In a real application, you would remove this and import useAuth from your context file.
// This is included to make the component self-contained and runnable for demonstration.
const useAuth = () => ({
  user: {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    profile: {
      avatar: 'https://placehold.co/100x100/EA4335/FFFFFF?text=P&font=roboto'
    }
  },
  logout: () => console.log("User logged out!"),
});

// --- ANIMATED SECTION COMPONENT ---
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

// --- ICONS ---
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const BriefcaseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const BuildingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-google-green mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);

// --- HEADER & FOOTER COMPONENTS ---
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
    { name: 'Funding', href: '/artisan/grants' }, // Added grants link
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


// --- MAIN GRANTS PAGE COMPONENT ---
const GrantsPage = () => {
  const { user, logout } = useAuth();
  const [grantsData, setGrantsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockGrantsData = {
    featuredOpportunity: {
      name: "Artisan Growth Fund",
      summary: "An exclusive fund dedicated to helping traditional artisans scale their business with modern tools and marketing strategies.",
      type: "Venture Capital"
    },
    aiMatchedInvestors: [
      {
        id: 1, name: 'Creative Ventures', type: 'Angel Investor', avatar: 'https://placehold.co/100x100/34A853/FFFFFF?text=CV',
        focus: 'Sustainable & Eco-friendly Crafts', investmentRange: '$1,000 - $10,000', matchScore: 92
      },
      {
        id: 2, name: 'Heritage Capital', type: 'Micro-VC', avatar: 'https://placehold.co/100x100/EA4335/FFFFFF?text=HC',
        focus: 'Preserving Traditional Art Forms', investmentRange: '$5,000 - $25,000', matchScore: 88
      },
      {
        id: 3, name: 'Ritu Sharma', type: 'Individual Investor', avatar: 'https://placehold.co/100x100/FBBC05/FFFFFF?text=RS',
        focus: 'Female Artisan Empowerment', investmentRange: '$500 - $5,000', matchScore: 81
      },
      {
        id: 4, name: 'InnovateCraft', type: 'Seed Fund', avatar: 'https://placehold.co/100x100/4285F4/FFFFFF?text=IC',
        focus: 'Tech-Enabled Artistry', investmentRange: '$10,000 - $50,000', matchScore: 75
      }
    ],
    governmentSchemes: [
      {
        id: 1, name: 'Pradhan Mantri MUDRA Yojana (PMMY)', offeredBy: 'Govt. of India',
        description: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises for income generating activities.',
        eligibility: 'All Indian citizens with a viable business plan.', link: 'https://www.mudra.org.in/'
      },
      {
        id: 2, name: 'Artisan Credit Card (ACC) Scheme', offeredBy: 'Ministry of Textiles',
        description: 'Provides timely and adequate credit to artisans to meet their credit requirements for investment and working capital.',
        eligibility: 'Artisans engaged in production/manufacturing process.', link: '#'
      }
    ]
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setGrantsData(mockGrantsData);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-google-green text-white';
    if (score >= 80) return 'bg-google-yellow text-gray-800';
    return 'bg-google-blue/20 text-google-blue';
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Finding Funding Opportunities...</div>
      </div>
    );
  }

  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <AnimatedSection>
          <div className="relative p-8 rounded-2xl shadow-xl mb-12 overflow-hidden text-white bg-google-green">
            <div className="absolute inset-0 z-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="patt" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="#fff" /></pattern></defs><rect width="100%" height="100%" fill="url(#patt)" /></svg>
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Funding & <span className="text-google-yellow">Grant Hub</span>
                </h1>
                <p className="text-lg max-w-lg mx-auto lg:mx-0 text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Discover AI-matched investors and government schemes to fuel your creative business.
                </p>
              </div>
              <div className="flex-shrink-0 w-64 lg:w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center">
                <p className="text-sm font-semibold text-google-green uppercase tracking-wider text-center mb-2">
                  Featured Opportunity
                </p>
                <h3 className="text-lg font-bold text-gray-800 text-center">{grantsData.featuredOpportunity.name}</h3>
                <p className="text-gray-600 text-sm mt-2 text-center">{grantsData.featuredOpportunity.summary}</p>
                <div className="flex justify-center mt-3">
                  <span className="text-xs font-medium bg-gray-200/80 text-gray-800 px-2 py-1 rounded-full">{grantsData.featuredOpportunity.type}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* --- AI-Matched Investors Section --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-blue">
              <BriefcaseIcon />
              <h2 className="text-3xl font-bold mt-4">AI-Matched Investors</h2>
              <p className="text-gray-600 mt-2 text-sm max-w-xs">Investors curated by our AI to match your profile and products.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {grantsData.aiMatchedInvestors.map((investor) => (
                <div key={investor.id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={investor.avatar} alt={investor.name} className="h-12 w-12 rounded-full border-2 border-gray-200" />
                      <div>
                        <h3 className="font-bold text-gray-800">{investor.name}</h3>
                        <p className="text-xs text-gray-500">{investor.type}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${getMatchScoreColor(investor.matchScore)}`}>
                      {investor.matchScore}%
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-4 text-sm space-y-2 flex-grow">
                    <p><strong className="font-semibold text-gray-700">Focus:</strong> <span className="text-gray-600">{investor.focus}</span></p>
                    <p><strong className="font-semibold text-gray-700">Range:</strong> <span className="text-gray-600">{investor.investmentRange}</span></p>
                  </div>
                  <button className="mt-4 w-full bg-google-blue text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- Government Schemes Section --- */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-red">
              <BuildingIcon />
              <h2 className="text-3xl font-bold mt-4">Government Schemes</h2>
              <p className="text-gray-600 mt-2 text-sm">Explore programs designed to support artisans and small businesses.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 gap-6">
              {grantsData.governmentSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{scheme.name}</h3>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{scheme.offeredBy}</p>
                    </div>
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="bg-google-blue/10 text-google-blue font-semibold px-4 py-2 rounded-lg text-sm hover:bg-google-blue/20 transition-colors">
                      Learn More
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm mt-3">{scheme.description}</p>
                  <div className="flex items-center mt-4 text-sm text-google-green font-semibold">
                    <CheckCircleIcon />
                    <span>Eligibility: {scheme.eligibility}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
};

export default GrantsPage;