import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';         
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection';
import StatCard from '../../components/artisan/StatCard';      
import {
  SparklesIcon, ArchiveIcon, TrendingUpIcon, GiftIcon, 
  TagIcon, SupportIcon, TruckIcon, LightBulbIcon, 
  PlusIcon,
  InboxIcon,
  BellIcon,
  CogIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '../../components/common/Icons';                      
import SkeletonCard from '../../components/ui/SkeletonCard';
import SkeletonStat from '../../components/ui/SkeletonStat';
import SkeletonListItem from '../../components/ui/SkeletonListItem';



const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, lowInventory: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, myProductsResponse] = await Promise.all([
          api.get('/orders'),
          api.get('/users/my-products'),
        ]);

        if (isMounted) {
          const activeOrders = ordersResponse.data.orders.filter(order => ['pending', 'confirmed', 'processing', 'in_production'].includes(order.status));
          const lowStockItems = myProductsResponse.data.products.filter(p => !p.inventory.isUnlimited && p.inventory.quantity < 5);
          setStats({ orders: activeOrders.length, lowInventory: lowStockItems.length });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const statsData = [
    { title: 'New Orders', value: stats.orders, icon: <ArchiveIcon />, color: 'text-google-blue', borderColor: 'border-google-blue', bgColor: 'bg-google-blue', link: '/artisan/orders', description: "View and manage incoming orders" },
    { title: 'Trending Craft', value: 'Block Printing', icon: <SparklesIcon />, color: 'text-google-green', borderColor: 'border-google-green', bgColor: 'bg-google-green', link: '/artisan/trends', description: "Discover high-demand art forms" },
    { title: 'Low Stock Alerts', value: `${stats.lowInventory} items`, icon: <TrendingUpIcon />, color: 'text-google-red', borderColor: 'border-google-red', bgColor: 'bg-google-red', link: '/artisan/products', description: "Replenish your popular items" },
  ];

  const mockActivity = [
      { id: 1, type: 'order', icon: <ArchiveIcon className="w-5 h-5 text-google-blue"/>, text: 'Order #KG1236 placed by S. Gupta', detail: '$45.50 - 2 items', time: '15m ago', link: '/artisan/orders'},
      { id: 2, type: 'stock', icon: <TrendingUpIcon className="w-5 h-5 text-google-red"/>, text: 'Low Stock: \'Hand-Painted Scarf\'', detail: 'Only 2 left', time: '1h ago', link: '/artisan/products/edit/prod_id_scarf'}, // Replace prod_id_scarf
      { id: 3, type: 'status', icon: <TruckIcon className="w-5 h-5 text-google-green"/>, text: 'Order #KG1230 status updated to Shipped', detail: 'View Order', time: '3h ago', link: '/artisan/orders'},
      { id: 4, type: 'message', icon: <InboxIcon className="w-5 h-5 text-gray-500"/>, text: 'New message from R. Kumar', detail: 'Regarding Custom Order', time: 'Yesterday', link: '#'}, // Link to messages page
      { id: 5, type: 'product', icon: <TagIcon className="w-5 h-5 text-purple-600"/>, text: 'Product \'Wooden Bowl Set\' added', detail: 'Status: Draft', time: '2 days ago', link: '/artisan/products/edit/prod_id_bowl'}, // Replace prod_id_bowl
  ];

  if (loading || !user) {
    return (
      <div className="px-6 md:px-8 py-8 md:py-10">
        <div className="h-40 bg-gray-200 rounded-2xl shadow-xl mb-10 md:mb-12 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-12">
          {[...Array(3)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                         <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border animate-pulse">
                 <div className="h-6 w-1/2 bg-gray-200 rounded mb-6"></div>
                 <div className="space-y-4">
                     <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                     <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                     <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                 </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-8 py-8 md:py-10">
      <AnimatedSection className="mb-10 md:mb-12">
        <div className="relative p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden text-white" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <header className="relative z-10 flex justify-center items-center text-center">
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                <span className="text-google-yellow">Your</span> Creative <span className="text-white">Dashboard</span>
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                Welcome back, {user.name}! Here's your workspace.
              </p>
            </div>
          </header>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mb-10 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <AnimatedSection className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="divide-y divide-gray-100">
              {mockActivity.length > 0 ? (
                mockActivity.map((item) => (
                  <Link to={item.link || '#'} key={item.id} className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out -mx-2 px-2 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.text}</p>
                        <p className="text-xs text-gray-500">{item.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-4">{item.time}</span>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent activity to show.</p>
              )}
            </div>
            {mockActivity.length > 0 && (
                 <div className="mt-4 text-center">
                     <Link to="#" className="text-sm font-semibold text-google-blue hover:underline">
                         View all activity
                     </Link>
                 </div>
             )}
          </div>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/artisan/products/new"
                className="flex items-center justify-center w-full bg-google-blue text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Product
              </Link>
              <Link
                to="/artisan/orders?filter=pending"
                className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors text-sm"
              >
                 <ArchiveIcon className="w-5 h-5 mr-3 text-gray-500" />
                 View Pending Orders
              </Link>
               <Link
                to="#"
                className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors text-sm"
              >
                 <InboxIcon className="w-5 h-5 mr-3 text-gray-500" />
                 Check Messages
              </Link>
               <Link
                to="#"
                className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors text-sm"
              >
                 <CogIcon className="w-5 h-5 mr-3 text-gray-500" />
                 Account Settings
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default ArtisanDashboard;