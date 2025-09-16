import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

// --- MOCK API & AUTH ---
// In a real application, you would import these from their respective files.
const api = {
  get: async (url) => {
    console.log(`Mock GET request to: ${url}`);
    if (url === '/users/my-products') {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
      // To test the empty state, return { data: { products: [] } }
      return {
        data: {
          products: [
            { _id: '1', name: 'Hand-Painted Ceramic Mug', status: 'active', price: 25.00, inventory: { isUnlimited: false, quantity: 15 } },
            { _id: '2', name: 'Jaipuri Blue Pottery Vase', status: 'active', price: 45.50, inventory: { isUnlimited: false, quantity: 8 } },
            { _id: '3', name: 'Embroidered Wall Hanging', status: 'draft', price: 75.00, inventory: { isUnlimited: true, quantity: 0 } },
            { _id: '4', name: 'Wooden Elephant Sculpture', status: 'inactive', price: 120.00, inventory: { isUnlimited: false, quantity: 3 } },
          ],
        },
      };
    }
    return { data: {} };
  },
  delete: async (url) => {
    console.log(`Mock DELETE request to: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 204 };
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
const TrashIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> );
const EditIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> );
const CollectionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>);

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
    { name: 'Funding', href: '/artisan/grant' },
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
            <NavLink key={link.name} to={link.href} className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>{link.name}</NavLink>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none">
              <img src={user.profile?.avatar} alt="Profile" className="h-10 w-10 rounded-full border-2 border-google-blue/50" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
                <div className="px-4 py-2 border-b"><p className="font-semibold text-gray-800 text-sm">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"><LogoutIcon /> Logout</button>
              </div>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-700"><MenuIcon /></button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-semibold text-google-blue">Menu</h2><button onClick={() => setIsMobileMenuOpen(false)}><XIcon /></button></div>
            <nav className="flex flex-col space-y-4">{navLinks.map(link => (<NavLink key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-md font-medium ${isActive ? 'bg-google-blue/10 text-google-blue' : 'text-gray-700 hover:bg-gray-100'}`}>{link.name}</NavLink>))}</nav>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-google-blue text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm">&copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved.</div>
    </div>
  </footer>
);

// --- MAIN MY PRODUCTS PAGE COMPONENT ---
const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/users/my-products');
            setProducts(response.data.products);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await api.delete(`/products/${productId}`);
                setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
            } catch (err) {
                setError('Failed to delete the product.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-google-blue text-xl font-semibold">Loading Your Creations...</div>
            </div>
        );
    }

    return (
        <>
            <ArtisanHeader user={user} logout={logout} />
            <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16">
                <AnimatedSection className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex items-center gap-6">
                            <div className="text-google-blue hidden sm:block"><CollectionIcon /></div>
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-800">My Product Portfolio</h1>
                                <p className="mt-1 text-gray-600">Here you can view, edit, and manage all your product listings.</p>
                            </div>
                        </div>
                        <Link to="/artisan/products/new" className="bg-google-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto text-center">
                            + Add New Product
                        </Link>
                    </div>
                </AnimatedSection>
                
                <AnimatedSection>
                    {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-6 font-medium border border-red-200">{error}</p>}
                    
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                        {products.length === 0 && !error ? (
                            <div className="text-center py-20 px-6">
                                <CollectionIcon className="mx-auto h-16 w-16 text-gray-300" />
                                <h2 className="mt-4 text-2xl font-bold text-gray-800">Your portfolio is empty.</h2>
                                <p className="text-gray-500 mt-2">Ready to showcase your talent? Add your first product to get started!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/70 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-semibold text-gray-600 tracking-wider">Product</th>
                                            <th className="p-4 font-semibold text-gray-600 tracking-wider">Status</th>
                                            <th className="p-4 font-semibold text-gray-600 tracking-wider">Price (INR)</th>
                                            <th className="p-4 font-semibold text-gray-600 tracking-wider">Inventory</th>
                                            <th className="p-4 font-semibold text-gray-600 tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product._id} className="border-b border-gray-200/80 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
                                                        product.status === 'active' ? 'bg-google-green/10 text-google-green' :
                                                        product.status === 'draft' ? 'bg-google-yellow/20 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-700">₹{product.price.toFixed(2)}</td>
                                                <td className="p-4 text-gray-700">{product.inventory.isUnlimited ? 'Made to Order' : product.inventory.quantity}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-4">
                                                        <Link to={`/artisan/products/edit/${product._id}`} className="text-gray-500 hover:text-google-blue transition-colors" title="Edit"><EditIcon /></Link>
                                                        <button onClick={() => handleDelete(product._id)} className="text-gray-500 hover:text-google-red transition-colors" title="Delete"><TrashIcon /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </AnimatedSection>
            </main>
            <Footer />
        </>
    );
};

export default MyProductsPage;