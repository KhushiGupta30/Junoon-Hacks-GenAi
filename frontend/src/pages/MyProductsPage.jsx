import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// --- ICONS ---
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const LogoutIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const PlusIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>);

// --- SHARED HEADER & FOOTER ---
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
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none"><img src={user.profile?.avatar || '/default-avatar.png'} alt="Profile" className="h-10 w-10 rounded-full border-2 border-google-blue/50" /></button>
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


const ProductRow = ({ product, onDelete }) => (
    <tr className="border-b hover:bg-gray-50">
        <td className="p-4">
            <div className="flex items-center space-x-4">
                <img 
                    src={product.images[0]?.url || 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=No+Image'} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                </div>
            </div>
        </td>
        <td className="p-4 text-center">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                product.status === 'active' ? 'bg-green-100 text-green-800' :
                product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
            }`}>
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
        </td>
        <td className="p-4 text-right font-medium">${product.price.toFixed(2)}</td>
        <td className="p-4 text-right">
            {product.inventory.isUnlimited ? 'Made to Order' : product.inventory.quantity}
        </td>
        <td className="p-4 text-right">
            <div className="flex justify-end space-x-2">
                <Link to={`/artisan/products/edit/${product._id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold hover:bg-google-blue hover:text-white transition-colors">
                    Edit
                </Link>
                <button onClick={() => onDelete(product._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors">
                    Delete
                </button>
            </div>
        </td>
    </tr>
);

const MyProductsPage = () => {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                // This API endpoint fetches products for the logged-in artisan
                const response = await api.get('/users/my-products');
                setProducts(response.data.products);
            } catch (err) {
                setError('Failed to fetch your products. Please try again.');
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                // This API endpoint deletes the specified product
                await api.delete(`/products/${productId}`);
                // Update the UI instantly by filtering out the deleted product
                setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                alert('Product deleted successfully.');
            } catch (err) {
                setError('Failed to delete product. Please try again.');
                console.error("Delete product error:", err);
            }
        }
    };

    return (
        <>
            <ArtisanHeader user={user} logout={logout} />
            <main className="pt-24 bg-gray-50 font-sans container mx-auto px-6 py-16 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">My Products</h1>
                    <Link to="/artisan/products/new" className="flex items-center bg-google-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <PlusIcon />
                        Add New Product
                    </Link>
                </div>

                {error && <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
                    {loading ? (
                        <p className="text-center p-10 text-gray-600">Loading your products...</p>
                    ) : products.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-4 text-left font-bold text-gray-600">Product</th>
                                    <th className="p-4 text-center font-bold text-gray-600">Status</th>
                                    <th className="p-4 text-right font-bold text-gray-600">Price</th>
                                    <th className="p-4 text-right font-bold text-gray-600">Stock</th>
                                    <th className="p-4 text-right font-bold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <ProductRow key={product._id} product={product} onDelete={handleDelete} />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-12">
                            <h2 className="text-2xl font-semibold text-gray-700">No Products Yet!</h2>
                            <p className="mt-2 text-gray-500">Click the "Add New Product" button to start selling your creations.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MyProductsPage;