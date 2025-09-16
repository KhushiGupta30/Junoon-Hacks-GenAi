import React, { useState, useEffect, useRef } from 'react';

// --- Mock Auth Context Hook ---
// In your real app, you would import this from your context file.
const useAuth = () => ({
  user: {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    profile: {
      avatar: 'https://placehold.co/100x100/4285F4/FFFFFF?text=AS&font=roboto'
    }
  },
  logout: () => console.log('Logged out!'),
});


// --- Reusable & Icon Components ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    observer.unobserve(ref.current);
    }
};
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /></svg>;
const LocationMarkerIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


// --- Modals ---
const ArtisanProgressModal = ({ artisan, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all opacity-0 scale-95 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-google-red transition-colors"><CloseIcon /></button>
            <div className="flex items-center mb-6">
                <img src={artisan.imageUrl} alt={artisan.name} className="h-16 w-16 rounded-full mr-4"/>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{artisan.name}</h3>
                    <p className="text-gray-500">{artisan.craft}</p>
                </div>
            </div>
            <h4 className="font-bold text-gray-700 mb-3">Onboarding Progress</h4>
            <div className="space-y-3">
                <div className="flex items-center text-google-green"><CheckCircleIcon /><span className="ml-2">Profile Complete</span></div>
                <div className="flex items-center text-google-green"><CheckCircleIcon /><span className="ml-2">First Product Listed</span></div>
                <div className="flex items-center text-gray-400"><CheckCircleIcon className="text-gray-300" /><span className="ml-2">First Sale Made</span></div>
                <div className="flex items-center text-gray-400"><CheckCircleIcon className="text-gray-300" /><span className="ml-2">Received Payout</span></div>
            </div>
        </div>
    </div>
);

const PlanEventModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all opacity-0 scale-95 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-google-red transition-colors"><CloseIcon /></button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Plan a New Event</h3>
            <form className="space-y-4">
                <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input type="text" id="eventName" className="mt-1 block w-full pl-3 pr-3 py-2 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-green transition-colors" placeholder="e.g., Local Pottery Workshop" />
                </div>
                <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <input type="datetime-local" id="eventDate" className="mt-1 block w-full pl-3 pr-3 py-2 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-green transition-colors" />
                </div>
                <div>
                    <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="eventDesc" rows="3" className="mt-1 block w-full pl-3 pr-3 py-2 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-green transition-colors resize-none" placeholder="What's the event about?"></textarea>
                </div>
                <button type="submit" className="w-full bg-google-green text-white font-bold py-3 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">Submit for Review</button>
            </form>
        </div>
    </div>
);


// --- HEADER COMPONENT ---
const AmbassadorHeader = ({ user, logout }) => {
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
    { name: 'Dashboard', href: '#/ambassador/dashboard' },
    { name: 'My Artisans', href: '#/ambassador/artisans' },
    { name: 'Events', href: '#/ambassador/events' },
    { name: 'Resources', href: '#/ambassador/resources' },
  ];

  const activeLinkStyle = "text-google-blue border-b-2 border-google-blue pb-1";
  const inactiveLinkStyle = "hover:text-google-blue transition";

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#/ambassador/dashboard" className="flex items-center space-x-3">
          <img src="/logo.png" alt="KalaGhar Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tighter">
            Kala<span className="text-google-blue">Ghar</span>
            <span className="text-lg font-medium text-gray-500 ml-3">Ambassador Hub</span>
          </h1>
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navLinks.map((link, index) => (
            <a key={link.name} href={link.href} className={index === 0 ? activeLinkStyle : inactiveLinkStyle}>
              {link.name}
            </a>
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
                <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100`}>
                  {link.name}
                </a>
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

// --- Main AmbassadorDashboardPage Component ---
const AmbassadorDashboardPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  const openProgressModal = (artisan) => {
      setSelectedArtisan(artisan);
      setIsProgressModalOpen(true);
  };

  // Mock Data
  const stats = {
      mentored: 12,
      events: 4,
      impactScore: 2800
  };
    const myArtisans = [
    { name: 'Priya S.', craft: 'Textile Weaver', imageUrl: 'https://placehold.co/100x100/DB4437/FFFFFF?text=PS' },
    { name: 'Anand V.', craft: 'Pottery Artist', imageUrl: 'https://placehold.co/100x100/0F9D58/FFFFFF?text=AV' },
    { name: 'Sita Devi', craft: 'Madhubani Painter', imageUrl: 'https://placehold.co/100x100/F4B400/FFFFFF?text=SD' },
  ];

  const nearbyAmbassadors = [
    { name: 'Isha Verma', location: 'Gurgaon', distance: '25 km away' },
    { name: 'Rohan Gupta', location: 'Noida', distance: '30 km away' },
    { name: 'Meera Singh', location: 'Faridabad', distance: '35 km away' },
  ];


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    { title: 'Artisans Mentored', value: stats.mentored, icon: <UsersIcon />, color: 'text-google-blue', borderColor: 'border-google-blue', bgColor: 'bg-google-blue', link: '#/ambassador/artisans', description: "View your artisan network" },
    { title: 'Events Hosted', value: stats.events, icon: <CalendarIcon />, color: 'text-google-green', borderColor: 'border-google-green', bgColor: 'bg-google-green', link: '#/ambassador/events', description: "Manage and plan events" },
    { title: 'Your Impact Score', value: stats.impactScore.toLocaleString(), icon: <SparklesIcon />, color: 'text-google-yellow', borderColor: 'border-google-yellow', bgColor: 'bg-google-yellow', link: '#', description: "See the difference you're making" },
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
      {/* --- Styles --- */}
      <style>{`
        .bg-google-blue { background-color: #4285F4; } .text-google-blue { color: #4285F4; } .border-google-blue { border-color: #4285F4; }
        .bg-google-red { background-color: #DB4437; } .text-google-red { color: #DB4437; } .border-google-red { border-color: #DB4437; }
        .bg-google-yellow { background-color: #F4B400; } .text-google-yellow { color: #F4B400; } .border-google-yellow { border-color: #F4B400; }
        .bg-google-green { background-color: #0F9D58; } .text-google-green { color: #0F9D58; } .border-google-green { border-color: #0F9D58; }
        .main-bg { background-color: #f8f9fa; }
        @keyframes fade-in-scale { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
      `}</style>
      
      <div className="main-bg min-h-screen font-sans flex flex-col justify-between">
        <div>
            <AmbassadorHeader user={user} logout={logout} />
            <main className="pt-8 bg-gray-50 font-sans">
                <div className="container mx-auto px-6 py-12">
                    <AnimatedSection>
                      <div className="relative p-8 rounded-2xl shadow-xl mb-8 overflow-hidden text-white" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <header className="relative z-10 flex justify-center items-center text-center">
                          <div className="flex-grow">
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                              Ambassador <span className="text-google-yellow">Hub</span>
                            </h1>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                              Welcome back, {user.name}! Make a difference today.
                            </p>
                          </div>
                        </header>
                      </div>
                    </AnimatedSection>

                    {/* --- Main Grid Layout --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* My Artisan Network */}
                            <AnimatedSection>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">My Artisan Network</h3>
                                    <div className="space-y-4">
                                        {myArtisans.map(artisan => (
                                            <div key={artisan.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center">
                                                    <img src={artisan.imageUrl} alt={artisan.name} className="h-12 w-12 rounded-full mr-4"/>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{artisan.name}</p>
                                                        <p className="text-sm text-gray-500">{artisan.craft}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => openProgressModal(artisan)} className="text-sm font-semibold text-google-blue hover:underline">View Progress</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Upcoming Events */}
                            <AnimatedSection>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h3>
                                    <p className="text-gray-500 text-sm">No upcoming events scheduled. <button onClick={() => setIsEventModalOpen(true)} className="font-semibold text-google-green hover:underline">Plan a new event?</button></p>
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <AnimatedSection>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        {statsData.map(stat => (
                                            <div key={stat.label} className={` p-4 rounded-lg flex items-center space-x-4 border-l-4 ${stat.borderColor} bg-gray-50`}>
                                                <div className={`text-${stat.color}`}>{stat.icon}</div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>
                            
                            {/* Find Ambassadors Near Me */}
                            <AnimatedSection>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Ambassadors Near Me</h3>
                                    <div className="space-y-3">
                                        {nearbyAmbassadors.map(ambassador => (
                                            <div key={ambassador.name} className="flex items-center text-sm">
                                                <LocationMarkerIcon className="text-gray-400 mr-2 flex-shrink-0" />
                                                <p className="font-semibold text-gray-700">{ambassador.name}</p>
                                                <p className="text-gray-500 ml-auto">{ambassador.distance}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                        </div>
                    </div>
                </div>
            </main>
        </div>
        <Footer />
        {isProgressModalOpen && selectedArtisan && <ArtisanProgressModal artisan={selectedArtisan} onClose={() => setIsProgressModalOpen(false)} />}
        {isEventModalOpen && <PlanEventModal onClose={() => setIsEventModalOpen(false)} />}
      </div>
    </>
  );
};

export default AmbassadorDashboardPage;

