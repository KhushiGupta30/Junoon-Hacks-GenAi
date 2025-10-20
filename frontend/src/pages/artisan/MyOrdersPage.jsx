import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Adjust path if needed
// Import Shared Components & Icons
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed
import {
    ArchiveIcon, // For page header and empty state
    ExclamationCircleIcon, // For error state
    CheckCircleIcon, // For completed orders sidebar
    CubeIcon // New icon for Bulk Orders tab
} from '../../components/common/Icons'; // Adjust path if needed

// --- Skeleton Component Placeholders ---
const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>;
const SkeletonTableRow = () => (
    <tr className="border-b border-gray-100">
        <td className="p-4"><SkeletonBase className="h-4 w-20" /></td>
        <td className="p-4"><SkeletonBase className="h-4 w-16 ml-auto" /></td>
        <td className="p-4"><SkeletonBase className="h-8 w-full rounded-md" /></td>
    </tr>
);
const SkeletonSidebarCard = () => <SkeletonBase className="h-64" />;
// --- End Skeletons ---

// --- Tab Component (Google Style - Copied from LogiPage) ---
const TabButton = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
            isActive ? 'text-google-blue font-medium' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 rounded-t-md'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>}
    </button>
);


const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'bulk'

    const fetchOrders = useCallback(async () => {
        // setLoading(true); // Maybe set true only on initial load or retry
        setError('');
        try {
            // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            const response = await api.get('/orders');
            // Ensure orders is always an array
            setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
        } catch (err) {
            setError('Failed to fetch orders. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter orders into pending, bulk, and completed using useMemo
    const { pendingOrders, bulkOrders, completedOrders } = useMemo(() => {
        const pending = [];
        const bulk = []; // Placeholder for bulk order logic
        const completed = [];
        const pendingStatuses = ['pending', 'confirmed', 'processing'];
        // Define criteria for bulk orders if applicable (e.g., quantity > 10, special tag)
        const isBulkOrder = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0) > 10; // EXAMPLE ONLY

        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders.forEach(order => {
            // Example bulk order check - MODIFY THIS LOGIC AS NEEDED
            if (isBulkOrder(order) && pendingStatuses.includes(order.status)) {
               bulk.push(order); // Add to bulk if it meets criteria AND is pending
            } else if (pendingStatuses.includes(order.status)) {
                pending.push(order); // Add to regular pending otherwise
            } else {
                completed.push(order); // Add to completed if not pending
            }
        });
        // Note: No need to filter pending again if bulk logic correctly separates them
        return { pendingOrders: pending, bulkOrders: bulk, completedOrders: completed };

    }, [orders]);


    const handleStatusChange = async (orderId, newStatus) => {
         // Optimistic Update (Optional but good UX)
         const originalOrders = [...orders];
         setOrders(currentOrders => currentOrders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Refetch might not be needed if optimistic update is sufficient
            // fetchOrders();
             console.log(`Order ${orderId} status updated to ${newStatus}`);
             // Show success snackbar here
        } catch (err) {
             console.error('Failed to update status:', err);
             setOrders(originalOrders); // Revert UI on error
             alert('Failed to update order status.'); // Replace with Snackbar
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
                {/* Main Content Skeleton */}
                <div className="flex-grow space-y-8">
                    <SkeletonBase className="h-10 w-3/4 mb-4"/> {/* Title */}
                    <SkeletonBase className="h-10 w-full mb-6"/> {/* Tabs */}
                    {/* Table Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 animate-pulse"/>
                </div>
                 {/* Sidebar Skeleton */}
                <div className="lg:w-80 flex-shrink-0 space-y-6">
                    <SkeletonSidebarCard />
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (error) {
       return (
            <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
                <div className="flex-grow">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4 text-red-600">
                            <ExclamationCircleIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-medium text-gray-700">Something went wrong</h2>
                        <p className="text-gray-500 mt-2 text-sm">{error}</p>
                        <div className="mt-6">
                            <button onClick={fetchOrders} className="inline-flex items-center px-4 py-2 bg-google-blue text-white rounded-md text-sm hover:brightness-95">Retry</button>
                        </div>
                    </div>
                </div>
                <aside className="lg:w-80 flex-shrink-0">
                    <SkeletonSidebarCard />
                </aside>
            </div>
        );
    }


    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
        processing: 'bg-purple-100 text-purple-800 border-purple-300',
        shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        delivered: 'bg-green-100 text-green-800 border-green-300',
        cancelled: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">

            {/* --- Main Content Area (Pending / Bulk Orders) --- */}
            <div className="flex-grow lg:w-2/3">
                 <AnimatedSection className="mb-8 text-center">
    <h1
        className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
        style={{
            background: 'linear-gradient(90deg, #FDD835, #FFC107)', 
            color: '#202124'
        }}
    >
        Customer Orders
    </h1>
    <p className="mt-3 text-gray-700 text-sm">
        View and manage orders placed for your products.
    </p>
</AnimatedSection>

                {/* --- Tab Navigation --- */}
                <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-0">
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                        {/* Added counts to tab titles */}
                        <TabButton title={`Pending Orders (${pendingOrders.length})`} isActive={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
                        <TabButton title={`Bulk Orders (${bulkOrders.length})`} isActive={activeTab === 'bulk'} onClick={() => setActiveTab('bulk')} />
                    </div>
                </div>

                <AnimatedSection>
                    {/* --- Pending Orders Tab Content --- */}
                    {activeTab === 'pending' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             {/* Optional Header inside card */}
                             {/* <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200">
                                <h2 className="text-base font-medium text-gray-700">Pending Orders</h2>
                            </div> */}
                            {pendingOrders.length === 0 ? (
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4 text-green-500"><CheckCircleIcon className="w-10 h-10" /></div>
                                    <h2 className="text-xl font-medium text-gray-700">All caught up!</h2>
                                    <p className="text-gray-500 mt-2 text-sm">You have no standard pending orders right now.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                         <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th className="px-4 py-3">Order Details</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                                <th className="px-4 py-3 text-center w-40">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pendingOrders.map(order => (
                                                <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                                                     <td className="px-4 py-3 align-top">
                                                        <p className="font-mono text-xs text-gray-500 mb-0.5">{order.orderNumber || order._id.slice(-6)}</p>
                                                        <p className="font-medium text-gray-800">{order.buyer?.name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                                                        <p className="text-xs text-gray-500 mt-1.5 truncate" title={order.items.map(i => i.product?.name).join(', ')}>
                                                            {order.items.length} item(s)
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-gray-800 text-right whitespace-nowrap align-top">${order.pricing?.total?.toFixed(2) || '0.00'}</td>
                                                    <td className="px-4 py-3 text-center align-top w-40">
                                                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`block w-full text-xs font-medium px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-google-blue focus:border-google-blue transition ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                            {statusOptions.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                     {/* --- Bulk Orders Tab Content --- */}
                     {activeTab === 'bulk' && (
                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             {/* Optional Header inside card */}
                              {/* <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200">
                                <h2 className="text-base font-medium text-gray-700">Bulk Orders</h2>
                            </div> */}
                             {bulkOrders.length === 0 ? (
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                                        <CubeIcon className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-medium text-gray-700">No Bulk Orders Found</h2>
                                    <p className="text-gray-500 mt-2 text-sm">Orders meeting bulk criteria will appear here.</p>
                                </div>
                             ) : (
                                <div className="overflow-x-auto">
                                    {/* You might want a different table structure for bulk orders */}
                                    <table className="w-full text-left text-sm">
                                         <thead className="bg-gray-50 border-b border-gray-200">
                                            {/* Example Thead for Bulk */}
                                             <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th className="px-4 py-3">Order Details</th>
                                                <th className="px-4 py-3 text-center">Total Items</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                                <th className="px-4 py-3 text-center w-40">Status</th>
                                            </tr>
                                        </thead>
                                         <tbody className="divide-y divide-gray-100">
                                            {bulkOrders.map(order => (
                                                <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                                                     <td className="px-4 py-3 align-top">
                                                        <p className="font-mono text-xs text-gray-500 mb-0.5">{order.orderNumber || order._id.slice(-6)}</p>
                                                        <p className="font-medium text-gray-800">{order.buyer?.name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                                                    </td>
                                                     <td className="px-4 py-3 text-center align-top">
                                                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                                     </td>
                                                     <td className="px-4 py-3 font-medium text-gray-800 text-right whitespace-nowrap align-top">${order.pricing?.total?.toFixed(2) || '0.00'}</td>
                                                     <td className="px-4 py-3 text-center align-top w-40">
                                                         <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`block w-full text-xs font-medium px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-google-blue focus:border-google-blue transition ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                             {statusOptions.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                                                         </select>
                                                     </td>
                                                </tr>
                                            ))}
                                         </tbody>
                                    </table>
                                </div>
                             )}
                         </div>
                    )}
                </AnimatedSection>
            </div>

            {/* --- Right Sidebar (Completed Orders) --- */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
                <AnimatedSection>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                           <CheckCircleIcon className="h-6 w-6 text-google-green" />
                           <h3 className="text-base font-medium text-gray-800">Completed Orders</h3>
                        </div>
                        {/* List container with scroll */}
                        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                            {completedOrders.length > 0 ? (
                                completedOrders.map(order => (
                                    <div key={order._id} className="p-4 hover:bg-gray-50/70 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <p className="font-medium text-sm text-gray-800 leading-snug">{order.buyer?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{order.orderNumber || order._id.slice(-6)}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.status.charAt(0).toUpperCase() + order.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                            <p className="text-sm font-medium text-gray-700">${order.pricing?.total?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-6 text-xs px-4">No completed orders yet.</p>
                            )}
                        </div>
                        {/* Footer Link */}
                        {completedOrders.length > 3 && (
                            <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                                <Link to="#" className="text-google-blue text-xs font-medium hover:underline">View all completed orders</Link>
                            </div>
                        )}
                    </div>
                </AnimatedSection>
            </aside>
        </div>
    );
};

export default MyOrdersPage;