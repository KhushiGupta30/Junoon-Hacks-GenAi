import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';

// --- MOCK API & AUTH ---
// In a real application, you would import these from their respective files.
const api = {
  get: async (url) => {
    console.log(`Mock GET request to: ${url}`);
    if (url.startsWith('/products/')) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { 
            data: { 
                product: {
                    _id: '1', name: 'Hand-Painted Ceramic Mug', status: 'active', price: 25.00, inventory: { isUnlimited: false, quantity: 15 },
                    description: 'A beautifully crafted mug, perfect for your morning coffee. Each piece is unique.', category: 'Pottery', 
                    images: [{ url: 'https://placehold.co/600x400/34A853/FFFFFF?text=Mug', alt: 'Ceramic Mug' }]
                } 
            }
        };
    }
    return { data: {} };
  },
  post: async (url, data) => {
    console.log(`Mock POST to ${url} with data:`, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // --- MOCK AI RESPONSE ---
    if (url === '/ai/generate-description') {
        return {
            data: {
                description: `Breathe in the aroma of freshly brewed coffee from a mug that's as unique as you are. This ${data.name} isn't just a piece of pottery; it's a small piece of art, lovingly handcrafted in the ${data.category} tradition. Each brushstroke tells a story, a testament to the artisan's skill and passion.\n\nCrafted from high-quality ceramic, its sturdy build and comfortable handle make it your perfect companion for cozy mornings and relaxing evenings. The vibrant, hand-painted design ensures that no two mugs are exactly alike, bringing a touch of individuality to your daily routine.\n\nWhether you're gifting it to a loved one or treating yourself, this mug is more than just a vessel—it's an experience, a celebration of craftsmanship that warms both your hands and your heart.`
            }
        };
    }
    return { data: { ...data, _id: 'new-product-id' } };
  },
  put: async (url, data) => {
    console.log(`Mock PUT to ${url} with data:`, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data };
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
const PencilAltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0h1v1h1a1 1 0 110 2h-1v1h-1V3a1 1 0 011-1zM3 9a1 1 0 011-1h1v1a1 1 0 11-2 0V9zm1-4h1v1H4V5zm6 4a1 1 0 011-1h1v1a1 1 0 11-2 0V9zm1-4h1v1h-1V5z" clipRule="evenodd" /><path d="M9 11a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm-4 4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm1-4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm6 4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm1-4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1z" /></svg>);


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
// This component contains the actual form fields and logic.
const ProductFormFields = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        category: initialData?.category || 'Other',
        status: initialData?.status || 'draft',
        inventory: {
            quantity: initialData?.inventory?.quantity ?? 1,
            isUnlimited: initialData?.inventory?.isUnlimited || false,
        },
        images: initialData?.images || [{ url: '', alt: '' }],
    });
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false); // New state for AI generation
    const [error, setError] = useState('');

    const categories = ['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other'];
    const statuses = ['draft', 'active', 'inactive'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('inventory.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({ ...prev, inventory: { ...prev.inventory, [key]: type === 'checkbox' ? checked : value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // --- NEW FUNCTION ---
    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.category) {
            alert('Please enter a Product Name and select a Category first.');
            return;
        }
        setIsGenerating(true);
        setError('');
        try {
            const response = await api.post('/ai/generate-description', {
                name: formData.name,
                category: formData.category,
            });
            setFormData(prev => ({ ...prev, description: response.data.description }));
        } catch (err) {
            setError('Failed to generate description. Please try again.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
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
                <div className="pb-5 border-b border-gray-200"><h2 className="text-xl font-bold text-google-blue">Core Details</h2><p className="mt-1 text-sm text-gray-500">This is the essential information for your product listing.</p></div>
                <FormInput label="Product Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="e.g., Hand-Painted Ceramic Mug" />
                <div>
                    {/* --- UPDATED LABEL AND BUTTON --- */}
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating}
                            className="flex items-center gap-1 text-xs font-semibold text-white bg-google-blue px-2 py-1 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                            <SparklesIcon />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Tell a story about your product, its inspiration, and the creation process." className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Price (INR)" id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="e.g., 1500.00" />
                    <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</FormSelect>
                </div>
            </div>

            <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200"><h2 className="text-xl font-bold text-google-green">Inventory & Status</h2><p className="mt-1 text-sm text-gray-500">Manage stock levels and visibility on the marketplace.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <FormInput label="Available Quantity" id="inventory.quantity" name="inventory.quantity" type="number" value={formData.inventory.quantity} onChange={handleChange} min="0" disabled={formData.inventory.isUnlimited} />
                        <div className="flex items-center mt-3"><input type="checkbox" id="inventory.isUnlimited" name="inventory.isUnlimited" checked={formData.inventory.isUnlimited} onChange={handleChange} className="h-4 w-4 text-google-blue border-gray-300 rounded focus:ring-google-blue" /><label htmlFor="inventory.isUnlimited" className="ml-3 block text-sm text-gray-800">Made to order (Unlimited Quantity)</label></div>
                    </div>
                    <FormSelect label="Product Status" id="status" name="status" value={formData.status} onChange={handleChange}>{statuses.map(stat => <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>)}</FormSelect>
                </div>
            </div>

            <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200"><h2 className="text-xl font-bold text-google-yellow">Product Images</h2><p className="mt-1 text-sm text-gray-500">A great picture is worth a thousand sales. Provide a URL for now.</p></div>
                <div className="mt-1"><FormInput label="Primary Image URL" id="images[0].url" name="images[0].url" type="text" value={formData.images[0].url} onChange={() => {}} placeholder="https://example.com/image.png" /></div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/artisan/products')} className="bg-gray-100 text-gray-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-google-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed">{loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}</button>
            </div>
        </form>
    );
};


// --- MAIN PAGE COMPONENT (ProductForm.jsx) ---
// This component orchestrates the entire page, providing the layout and data.
const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isEditMode = !!productId;

  // In a real app, you would fetch this data if in edit mode.
  const mockInitialData = isEditMode ? {
    _id: productId,
    name: 'Hand-Painted Ceramic Mug',
    description: 'A beautifully crafted mug, perfect for your morning coffee. Each piece is unique.',
    price: '1250.00',
    category: 'Pottery',
    status: 'active',
    inventory: { quantity: 15, isUnlimited: false },
    images: [{ url: 'https://placehold.co/600x400/34A853/FFFFFF?text=Mug', alt: 'Ceramic Mug' }],
  } : null;

  const handleFormSubmit = async (formData) => {
    try {
        if (isEditMode) {
          await api.put(`/products/${productId}`, formData);
          alert('Product updated successfully!');
        } else {
          await api.post('/products', formData);
          alert('Product created successfully!');
        }
        navigate('/artisan/products');
    } catch (error) {
        console.error("Failed to submit form:", error);
        // Re-throw the error so the form's own catch block can display it in the UI.
        throw error;
    }
  };
  
  return (
    <>
      <ArtisanHeader user={user} logout={logout} />
      
      {/* This main tag is already structured correctly for consistent padding. */}
      <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16 min-h-screen">
        <AnimatedSection className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-google-blue hidden sm:block"><PencilAltIcon /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                <p className="mt-1 text-gray-600">
                  {isEditMode 
                    ? `You are currently editing "${mockInitialData.name}".`
                    : 'Fill out the form below to add a new creation to your portfolio.'}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection>
          <ProductFormFields initialData={mockInitialData} onSubmit={handleFormSubmit} />
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
};

export default ProductForm;