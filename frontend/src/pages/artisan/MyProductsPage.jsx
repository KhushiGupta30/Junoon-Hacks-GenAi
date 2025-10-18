import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
// import { useAuth } from '../../context/AuthContext'; // Removed

// --- ICONS (Keep ones used by this page) ---
const PlusIcon = () => (<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>);

// --- REMOVED ArtisanHeader component ---

// --- REMOVED Footer component ---


// --- PAGE-SPECIFIC COMPONENT (Keep) ---
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
    // const { user, logout } = useAuth(); // Removed
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
            {/* <ArtisanHeader user={user} logout={logout} /> REMOVED */}

            {/* Page content wrapper with padding */}
            <div className="container mx-auto px-6 py-16">
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
            </div>
            
            {/* <Footer /> REMOVED */}
        </>
    );
};

export default MyProductsPage;