import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/orders');
            setOrders(response.data.orders);
        } catch (err) {
            setError('Failed to fetch orders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // While the backend logic for updating a single item's status is complex,
    // we will update the overall order status for simplicity, as the backend supports this.
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Refresh the orders list to show the change
            fetchOrders(); 
        } catch (err) {
            alert('Failed to update order status.'); // Simple feedback for now
            console.error('Failed to update status:', err);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your orders...</div>;
    }

    // A helper to format dates nicely
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    // Status options for the dropdown
    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];


    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                     <h1 className="text-3xl font-bold text-gray-800">
                        Customer Orders
                    </h1>
                    <Link to="/artisan/dashboard" className="text-sm text-google-blue hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto p-6">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-700">No orders found.</h2>
                            <p className="text-gray-500 mt-2">When a customer places an order for your products, it will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b bg-gray-50 text-sm text-gray-600">
                                        <th className="p-4">Order #</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Items</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-mono text-sm text-gray-700">{order.orderNumber}</td>
                                            <td className="p-4 text-sm">{formatDate(order.createdAt)}</td>
                                            <td className="p-4 font-medium">{order.buyer.name}</td>
                                            <td className="p-4 text-sm">
                                                <ul className="list-disc list-inside">
                                                    {order.items.map(item => (
                                                        <li key={item.product._id}>{item.product.name} (x{item.quantity})</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="p-4 font-semibold">${order.pricing.total.toFixed(2)}</td>
                                            <td className="p-4">
                                                <select 
                                                    value={order.status} 
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="block w-full px-2 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"
                                                >
                                                   {statusOptions.map(status => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                   ))}
                                                </select>
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

export default MyOrdersPage;