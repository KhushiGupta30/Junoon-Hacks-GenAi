import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const TrashIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> );
const EditIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> );

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/my-products');
            setProducts(response.data.products);
        } catch (err) {
            setError('Failed to fetch products.');
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
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your products...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                     <h1 className="text-3xl font-bold text-gray-800">
                        Manage My Products
                    </h1>
                    <div className='flex items-center gap-4'>
                        <Link to="/artisan/products/new" className="bg-google-green text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            + Add New Product
                        </Link>
                         <Link to="/artisan/dashboard" className="text-sm text-google-blue hover:underline">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-700">No products found.</h2>
                            <p className="text-gray-500 mt-2">Get started by adding your first product!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-4">Product Name</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Inventory</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium">{product.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ product.status === 'active' ? 'bg-green-100 text-green-800' : product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800' }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="p-4">${product.price.toFixed(2)}</td>
                                            <td className="p-4">{product.inventory.isUnlimited ? 'Unlimited' : product.inventory.quantity}</td>
                                            <td className="p-4">
                                                <div className="flex space-x-3">
                                                    <Link to={`/artisan/products/edit/${product._id}`} className="text-gray-500 hover:text-blue-600"><EditIcon /></Link>
                                                    <button onClick={() => handleDelete(product._id)} className="text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyProductsPage;