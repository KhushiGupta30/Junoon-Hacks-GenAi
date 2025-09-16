import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

// --- MOCK API & AUTH ---
// In a real application, you would import these from their respective files.
const api = {
  post: async (url, data) => {
    console.log(`Mock POST to ${url} with data:`, data);
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
    // To test an error, uncomment the next line:
    // throw new Error("Mock server error: This idea title already exists.");
    return { status: 201, data: { ...data, _id: 'idea-123' } };
  },
};

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


// --- REUSABLE ANIMATED SECTION COMPONENT ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current) };
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

// --- ICONS ---
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const LightBulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);

// --- SHARED HEADER & FOOTER COMPONENTS ---
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
          <h1 className="text-3xl font-bold text-gray-800 tracking-tighter">Kala<span className="text-google-blue">Ghar</span><span className="text-lg font-medium text-gray-500 ml-3">Artisan Hub</span></h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">{navLinks.map(link => (<NavLink key={link.name} to={link.href} className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>{link.name}</NavLink>))}</nav>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none"><img src={user.profile?.avatar} alt="Profile" className="h-10 w-10 rounded-full border-2 border-google-blue/50" /></button>
            {isProfileOpen && (<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down"><div className="px-4 py-2 border-b"><p className="font-semibold text-gray-800 text-sm">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div><button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"><LogoutIcon /> Logout</button></div>)}
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-700"><MenuIcon /></button>
        </div>
      </div>
      {isMobileMenuOpen && (<div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}><div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-5" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h2 className="text-lg font-semibold text-google-blue">Menu</h2><button onClick={() => setIsMobileMenuOpen(false)}><XIcon /></button></div><nav className="flex flex-col space-y-4">{navLinks.map(link => (<NavLink key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-md font-medium ${isActive ? 'bg-google-blue/10 text-google-blue' : 'text-gray-700 hover:bg-gray-100'}`}>{link.name}</NavLink>))}</nav></div></div>)}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-google-blue text-white">
    <div className="container mx-auto px-6 py-12"><div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm">&copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved.</div></div>
  </footer>
);


// --- INTERNAL FORM FIELDS COMPONENT ---
const IdeaSubmissionFormFields = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const FormInput = ({ label, id, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <input id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm" />
        </div>
    );

    const FormSelect = ({ label, id, children, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <select id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm">{children}</select>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8 border border-gray-200">
            {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg font-medium border border-red-200">{error}</p>}
            
            <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-google-yellow">Describe Your Idea</h2>
                    <p className="mt-1 text-sm text-gray-500">Provide the core details of your new concept.</p>
                </div>
                
                <FormInput label="Idea Title" id="title" name="title" type="text" value={formData.title} onChange={handleChange} required placeholder="e.g., Self-Watering Terracotta Planters" />
                
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Detailed Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="6" placeholder="Describe your idea. What makes it unique? What materials would you use? What's the story behind it?" className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"></textarea>
                </div>

                <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </FormSelect>
            </div>

            <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/artisan/dashboard')} className="bg-gray-100 text-gray-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-google-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed">
                    {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </form>
    );
};


// --- MAIN PAGE COMPONENT (IdeaSubmissionPage.jsx) ---
const IdeaSubmissionPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleFormSubmit = async (formData) => {
    try {
        await api.post('/ideas', formData);
        alert('Your idea has been submitted successfully!');
        navigate('/artisan/dashboard');
    } catch (err) {
        console.error("Failed to submit idea:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to submit your idea. Please try again.";
        // Re-throw the error so the form's internal state can handle displaying it
        throw new Error(errorMessage);
    }
  };
  
  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16 min-h-screen">
        <AnimatedSection className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-google-yellow hidden sm:block"><LightBulbIcon /></div>
              <div >
                <h1 className="text-4xl font-extrabold text-gray-800">Submit a New Idea</h1>
                <p className="mt-1 text-gray-600">Share your next masterpiece to get feedback and pre-orders from the community.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection>
          <IdeaSubmissionFormFields onSubmit={handleFormSubmit} />
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
};

export default IdeaSubmissionPage;