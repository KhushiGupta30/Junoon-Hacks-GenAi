import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

// --- MOCK AUTH CONTEXT ---
// In a real application, you would remove this and import useAuth from your context file.
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
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const ChatAlt2Icon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>);

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
    { name: 'Funding', href: '/artisan/grants' },
    { name: 'Logistics', href: '/artisan/logistics' },
    { name: 'Community', href: '/artisan/community' },
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


// --- MAIN COMMUNITY PAGE COMPONENT ---
const CommunityPage = () => {
  const { user, logout } = useAuth();
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockCommunityData = {
    location: "New Delhi, Delhi",
    areaAmbassador: {
      name: "Anjali Singh",
      avatar: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      title: "KalaGhar Ambassador - South Delhi",
      bio: "A seasoned textile artist with 15+ years of experience, passionate about helping local artisans access new markets and funding.",
      specialties: ["Textile Arts", "Business Scaling", "Grant Applications"],
    },
    localArtisans: [
      { id: 1, name: 'Rohan Verma', avatar: 'https://placehold.co/100x100/34A853/FFFFFF?text=RV', craft: 'Pottery', distance: '2.5 km away' },
      { id: 2, name: 'Meera Patel', avatar: 'https://placehold.co/100x100/4285F4/FFFFFF?text=MP', craft: 'Madhubani Painting', distance: '4.1 km away' },
      { id: 3, name: 'Sanjay Kumar', avatar: 'https://placehold.co/100x100/FBBC05/FFFFFF?text=SK', craft: 'Woodcarving', distance: '5.8 km away' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Hauz Khas Village Art Market', date: 'Sat, 27 Sep 2025', location: 'Hauz Khas Village, New Delhi', description: 'Monthly market to showcase and sell your creations directly to customers.' },
      { id: 2, title: 'Digital Marketing Workshop for Artisans', date: 'Wed, 01 Oct 2025', location: 'Online via Zoom', description: 'Learn how to use social media to boost your sales and build your brand.' },
    ],
    discussionTopics: [
        { id: 1, title: 'Best place to source high-quality clay in Delhi?', author: 'Rohan V.', replies: 5, lastReplyTime: '2h ago' },
        { id: 2, title: 'Tips for pricing handmade jewelry for international buyers', author: 'Priya S.', replies: 12, lastReplyTime: '1d ago' },
    ]
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCommunityData(mockCommunityData);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Building your community connections...</div>
      </div>
    );
  }

  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <AnimatedSection>
          <div className="relative p-8 rounded-2xl shadow-xl mb-16 overflow-hidden bg-google-yellow">
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/memphis-mini.png')]"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

              {/* Left Text Section (hidden on small screens) */}
              <div className="hidden md:block w-1/2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                  KalaGhar Connect
                </h1>
                <p className="text-lg max-w-lg text-white/90 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  Your local hub in <span className="font-bold text-white">{communityData.location}</span>.
                  Find support from your Area Ambassador and grow with fellow artisans.
                </p>
              </div>

              {/* Ambassador Card (always shown, takes full width on small screens) */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 flex flex-col items-center text-center border border-white max-w-sm">
                  <p className="text-sm font-semibold text-google-blue uppercase tracking-wider mb-3">Your Area Ambassador</p>
                  <img src={communityData.areaAmbassador.avatar} alt={communityData.areaAmbassador.name} className="h-24 w-24 rounded-full border-4 border-white shadow-lg mb-2" />
                  <h3 className="text-xl font-bold text-gray-900">{communityData.areaAmbassador.name}</h3>
                  <p className="text-xs text-gray-600 font-medium">{communityData.areaAmbassador.title}</p>
                  <p className="text-gray-700 text-sm mt-3">{communityData.areaAmbassador.bio}</p>
                  <button className="mt-4 w-full max-w-xs bg-google-blue text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors shadow">
                    Contact for Help
                  </button>
                </div>
              </div>

            </div>
          </div>
        </AnimatedSection>


        {/* --- UPCOMING EVENTS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-red">
              <CalendarIcon />
              <h2 className="text-3xl font-bold mt-4">Upcoming Local Events</h2>
              <p className="text-gray-600 mt-2 text-sm">Don't miss out on local markets, workshops, and meetups.</p>
            </div>
            <div className="w-full lg:w-8/12 space-y-4">
              {communityData.upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                      <p className="text-sm font-semibold text-google-red">{event.date} &bull; {event.location}</p>
                    </div>
                    <button className="bg-google-red/10 text-google-red font-semibold px-4 py-2 rounded-lg text-sm hover:bg-google-red/20 transition-colors whitespace-nowrap">
                      Register
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- LOCAL ARTISANS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-green">
              <UsersIcon />
              <h2 className="text-3xl font-bold mt-4">Artisans Near You</h2>
              <p className="text-gray-600 mt-2 text-sm">Connect, collaborate, and learn from creators in your area.</p>
            </div>
            <div className="w-full lg:w-8/12 space-y-4">
              {communityData.localArtisans.map((artisan) => (
                <div key={artisan.id} className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition-shadow flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={artisan.avatar} alt={artisan.name} className="h-14 w-14 rounded-full" />
                    <div>
                      <h3 className="font-bold text-gray-800">{artisan.name}</h3>
                      <p className="text-sm text-gray-500">{artisan.craft}</p>
                      <p className="text-xs text-google-blue font-semibold">{artisan.distance}</p>
                    </div>
                  </div>
                  <button className="bg-google-blue/10 text-google-blue font-semibold px-4 py-2 rounded-lg text-sm hover:bg-google-blue/20 transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- COMMUNITY DISCUSSIONS --- */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center text-gray-500">
              <ChatAlt2Icon />
            </div>
            <h2 className="text-3xl font-bold mt-4">Active Discussions</h2>
            <p className="text-gray-600 mt-2 text-sm">Ask questions, share advice, and get feedback from the community.</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border p-4 space-y-2">
            {communityData.discussionTopics.map(topic => (
              <div key={topic.id} className="p-3 hover:bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="font-bold text-gray-800 cursor-pointer hover:text-google-blue">{topic.title}</p>
                  <p className="text-xs text-gray-500">by {topic.author} &bull; {topic.replies} replies &bull; Last reply {topic.lastReplyTime}</p>
                </div>
                <button className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors w-full sm:w-auto">
                  Join Discussion
                </button>
              </div>
            ))}
            <div className="pt-2 text-center">
              <Link to="#" className="text-google-blue font-semibold hover:underline">View All Discussions</Link>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
};

export default CommunityPage;