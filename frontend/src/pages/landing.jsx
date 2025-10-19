import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the auth hook

// --- SVG Icons (No changes) ---
const ArtisanIcon = () => (
    <svg className="w-12 h-12 mb-4 text-google-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.47 7.712A8.995 8.995 0 0112 4.5a8.995 8.995 0 016.53 3.212M5.47 16.288A8.995 8.995 0 0012 19.5a8.995 8.995 0 006.53-3.212"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5V2.25m0 19.5V19.5m-7.288-6.53H2.25m19.5 0H19.5"></path></svg>
);
const BuyerIcon = () => (
    <svg className="w-12 h-12 mb-4 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);
const InvestorIcon = () => (
    <svg className="w-12 h-12 mb-4 text-google-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
);
const AmbassadorIcon = () => (
    <svg className="w-12 h-12 mb-4 text-google-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);

// --- Reusable Animated Section (No changes) ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>{children}</div>
  );
};

// --- MODIFIED Header Component ---
const Header = ({ onLoginClick }) => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Kalaghar Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tighter">
              Kala<span className="text-google-blue">Ghar</span>
            </h1>
          </Link>
    
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#WhatIsKalaGhar" className="hover:text-google-blue transition">About</a>
            <a href="#findyourplace" className="hover:text-google-blue transition">Join as</a>
            <a href="#ExplainerCarousel" className="hover:text-google-blue transition">Features</a>
            <a href="#roles" className="hover:text-google-blue transition">Apply Now</a>
            <a href="#contact" className="hover:text-google-blue transition">Contact</a>
          </nav>

          {isAuthenticated ? (
             <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-700">
                    Welcome, {user.name}!
                </span>
                <Link to={user.role === 'artisan' ? '/artisan/dashboard' : '/buyer'} className="bg-google-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    Dashboard
                </Link>
                <button
                    onClick={logout}
                    className="bg-google-red text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Logout
                </button>
             </div>
          ) : (
            <button
                onClick={onLoginClick}
                className="bg-google-green text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors duration-300 transform hover:scale-105"
            >
                Login / Signup
            </button>
          )}
        </div>
      </header>
    );
};

// --- MODIFIED LoginModal Component ---
const LoginModal = ({ isOpen, onClose, selectedRole }) => {
    const { login, register } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(selectedRole || 'buyer');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // When the modal opens, set the role from props
        if (isOpen) {
            setRole(selectedRole || 'buyer');
            setError(''); // Clear previous errors
        }
    }, [isOpen, selectedRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(name, email, password, role);
            }
            onClose(); // Close modal on success
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Joining as an <span className="font-semibold text-blue-600">{role}</span>.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
            {!isLoginView && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am an:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="buyer">Buyer</option>
                        <option value="artisan">Artisan</option>
                        <option value="investor">Investor</option>
                        <option value="ambassador">Ambassador</option>
                    </select>
                </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-blue-300">
                {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
                {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    );
};


// --- Other components (Hero, WhatIsKalaGhar, etc.) are unchanged ---
const Hero = () => (
    <section className="min-h-screen flex items-center justify-center pt-24 md:pt-0 bg-cover bg-center relative text-center" style={{ backgroundImage: "url('/1.png')" }} >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4"> Where <span className="text-google-yellow">Artistry</span> Meets{" "} <span className="text-google-blue">Opportunity</span>. </h2>
          <p className="text-lg text-white/90 font-medium mb-8"> </p>
          <a href="#roles" className="bg-google-red text-white font-bold px-8 py-4 rounded-full hover:bg-google-blue transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-xl" > Join Our Community </a>
        </div>
      </div>
    </section>
);
const testimonials = [
    { quote: "KalaGhar didn't just give me a marketplace; it gave my craft a global voice. My sales have tripled, connecting me with buyers who truly appreciate my heritage.", name: "Priya S.", role: "Textile Weaver from Rajasthan" },
    { quote: "As a buyer, discovering authentic, handmade pieces with rich stories behind them has been a joy. This platform is a treasure trove of culture.", name: "David L.", role: "Art Collector from New York" },
    { quote: "Volunteering as an Ambassador has been incredibly fulfilling. I'm helping preserve my community's traditions by bridging our local artisans to the world.", name: "Rohan D.", role: "KalaGhar Ambassador from Gujarat" }
];
const WhatIsKalaGhar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const handleNext = useCallback(() => {
    if (isFading) return; 
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsFading(false);
    }, 300);
  }, [isFading]);
  const handlePrev = () => {
    if (isFading) return; 
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
      setIsFading(false);
    }, 300);
  };
  useEffect(() => {
    const timer = setInterval(() => { handleNext(); }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);
  const { quote, name, role } = testimonials[currentIndex];
  return (
    <section id="WhatIsKalaGhar" className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h3 className="text-4xl font-bold text-gray-800 mb-6"> What is <span className="text-black">Kala</span> <span className="text-google-blue">Ghar</span>? </h3>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"> KalaGhar is a digital ecosystem designed to celebrate and empower artisans by connecting them with buyers, investors, and ambassadors worldwide. We bridge tradition with technology, helping preserve cultural heritage while creating sustainable growth opportunities. </p>
          </div>
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8 relative overflow-hidden min-h-[280px] flex items-center">
                <svg className="absolute top-4 left-6 w-16 h-16 text-gray-200 opacity-50 transform -translate-x-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.333 22.667h4L15.333 16h-4L9.333 22.667zM22.667 22.667h4L28.667 16h-4L22.667 22.667zM4 28c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2h-8L8 4H4v12h6v12H6c-1.1 0-2 .9-2 2zM18 28c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2h-8l-4-10h-4v12h6v12h-2c-1.1 0-2 .9-2 2z"></path>
                </svg>
                <div className={`w-full relative z-10 transition-opacity duration-300 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="text-xl italic text-gray-700 mb-6 font-serif"> "{quote}" </p>
                    <div className="text-right">
                        <p className="font-bold text-gray-800">{name}</p>
                        <p className="text-sm text-google-blue font-medium">{role}</p>
                    </div>
                </div>
            </div>
            <button onClick={handlePrev} className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20" aria-label="Previous testimonial" >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={handleNext} className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20" aria-label="Next testimonial" >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
const Findyourplace = () => (
  <section id="findyourplace" className="py-20 bg-gray-50 relative">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-black">Find Your Place in Our Community</span>
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you create, collect, invest, or champion, there's a vital role for you at KalaGhar.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/artisan" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-yellow mb-3">For Artisans</h4>
            <p className="text-gray-600 leading-relaxed">Showcase your craft, access powerful tools, and sell to a global audience that values your unique talent.</p>
          </div>
          <div className="h-2 bg-google-yellow"></div>
        </Link>
        <Link to="/buyer" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-green mb-3">For Buyers</h4>
            <p className="text-gray-600 leading-relaxed">Discover authentic, handcrafted treasures. Connect with creators and own a piece of their story.</p>
          </div>
          <div className="h-2 bg-google-green"></div>
        </Link>
        <Link to="/buyer" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-blue mb-3">For Investors</h4>
            <p className="text-gray-600 leading-relaxed">Fund creative projects with real impact. Support the growth of cultural heritage and sustainable businesses.</p>
          </div>
          <div className="h-2 bg-google-blue"></div>
        </Link>
        <Link to="/ambassador" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-red mb-3">For Ambassadors</h4>
            <p className="text-gray-600 leading-relaxed">Be a champion for artisans. Volunteer your passion to mentor, connect, and empower creators in your community.</p>
          </div>
          <div className="h-2 bg-google-red"></div>
        </Link>
      </div>
    </div>
  </section>
);
const ExplainerCarousel = () => {
  const features = [
    { title: "AI & Insights", description: "Get trend reports, auto product pages, and a voice guide to track demand and pricing.", icon: "🤖" },
    { title: "Funding & Growth", description: "Access grants, micro-loans, and certifications with sustainability-focused support.", icon: "💡" },
    { title: "Storytelling & Engagement", description: "Showcase product stories with video/audio, and involve buyers through votes & pre-orders.", icon: "📖" },
    { title: "Support & Reach", description: "Get help from Karigar Ambassadors, hybrid events, and shared logistics networks.", icon: "🌍" },
  ];
  return (
    <section id="ExplainerCarousel" className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/2.png')" }}>
      <div className="container mx-auto px-6 text-center">
        <AnimatedSection>
          <h3 className="text-4xl font-bold text-gray-800 mb-4"> How It Works ? </h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto"> A seamless platform connecting every part of the artisan economy. </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index}>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold text-google-blue mb-2"> {feature.title} </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
const Roles = ({ onRoleSelect }) => {
  const roles = [
    { name: "Artisan", description: "Showcase your craft.", icon: <ArtisanIcon /> },
    { name: "Buyer", description: "Discover unique products.", icon: <BuyerIcon /> },
    { name: "Investor", description: "Fund creative projects.", icon: <InvestorIcon /> },
    { name: "Ambassador", description: "Champion artisans.", icon: <AmbassadorIcon /> },
  ];
  return (
    <section id="roles" className="py-20 bg-cover bg-center relative" >
      <div className="container mx-auto px-6 text-center">
        <AnimatedSection>
          <h3 className="text-4xl font-bold text-gray-800 mb-4"> Apply Now! </h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto"> Whether you create, collect, invest, or champion, KalaGhar has a place for you. </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => (
            <AnimatedSection key={role.name}>
              <div onClick={() => onRoleSelect(role.name)} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-google-blue hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center h-full" >
                {role.icon}
                <h4 className="text-2xl font-bold text-gray-800 mb-2"> {role.name} </h4>
                <p className="text-gray-600">{role.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
const Footer = () => (
  <footer className="bg-google-blue text-white">
     <section id="contact" ></section>
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-4">KalaGhar</h4>
          <p className="text-white/80 text-sm"> Empowering Artisans Worldwide. </p>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Explore</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> About Us </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Careers </a> </li> </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Connect</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Instagram </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Twitter </a> </li> </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Legal</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Terms </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Privacy </a> </li> </ul>
        </div>
      </div>
      <div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm"> &copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved. </div>
    </div>
  </footer>
);

// --- Main Page ---
export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };
  const handleOpenModal = () => {
    setSelectedRole(''); // Clear role if opened from header
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="font-sans bg-white">
      <Header onLoginClick={handleOpenModal} />
      <main>
        <Hero />
        <WhatIsKalaGhar />
        <Findyourplace />
        <ExplainerCarousel />
        <Roles onRoleSelect={handleRoleSelect} />
      </main>
      <Footer />
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        selectedRole={selectedRole}
      />
    </div>
  );
}