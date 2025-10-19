import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection';
import StatCard from '../../components/artisan/StatCard';
import {
  SparklesIcon, ArchiveIcon, TrendingUpIcon, GiftIcon,
  TagIcon, SupportIcon, TruckIcon, LightBulbIcon
} from '../../components/common/Icons';

// Renamed component to ArtisanDashboard
const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, lowInventory: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const ordersResponse = await api.get('/orders');
        const myProductsResponse = await api.get('/users/my-products');
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

  // ... (rest of the component logic for statsData and featureCards remains identical) ...
  const statsData = [
    { title: 'New Orders', value: stats.orders, icon: <ArchiveIcon />, color: 'text-google-blue', borderColor: 'border-google-blue', bgColor: 'bg-google-blue', link: '/artisan/orders', description: "View and manage incoming orders" },
    { title: 'Trending Craft', value: 'Block Printing', icon: <SparklesIcon />, color: 'text-google-green', borderColor: 'border-google-green', bgColor: 'bg-google-green', link: '/artisan/trends', description: "Discover high-demand art forms" },
    { title: 'Low Stock Alerts', value: `${stats.lowInventory} items`, icon: <TrendingUpIcon />, color: 'text-google-red', borderColor: 'border-google-red', bgColor: 'bg-google-red', link: '/artisan/products', description: "Replenish your popular items" },
  ];

  const featureCards = [
    { title: 'Manage Products', description: 'Add, edit, or remove your listings.', icon: <TagIcon />, imageUrl: 'https://placehold.co/400x200/F0F8FF/4285F4?text=Products&font=roboto&ts=28', link: '/artisan/products' },
    { title: 'Submit a New Idea', description: 'Get feedback from the community.', icon: <LightBulbIcon />, imageUrl: 'https://placehold.co/400x200/FFFAF0/F4B400?text=New+Idea&font=roboto&ts=28', link: '/artisan/ideas/new' },
    { title: 'AI Trend Reports', description: 'Insights, graphs, and tips.', icon: <TrendingUpIcon />, imageUrl: 'https://placehold.co/400x200/E8F0FE/DB4437?text=Trends&font=roboto&ts=28', link: '/artisan/trends' },
    { title: 'Grants & Investors', description: 'Find funding for your ideas.', icon: <GiftIcon />, imageUrl: 'https://placehold.co/400x200/F0FFF0/0F9D58?text=Funding&font=roboto&ts=28', link: '/artisan/grant' },
    { title: 'Community Support', description: 'Connect with fellow artisans.', icon: <SupportIcon />, imageUrl: 'https://placehold.co/400x200/FFF0F5/DB4437?text=Community&font=roboto&ts=28', link: '/artisan/community' },
    { title: 'Logistics Hub', description: 'Handle shipping with ease.', icon: <TruckIcon />, imageUrl: 'https://placehold.co/400x200/E6E6FA/4285F4?text=Logistics&font=roboto&ts=28', link: '/artisan/logistics' },
  ];


  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
        <div className="text-google-blue text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <AnimatedSection>
        <div className="relative p-8 rounded-2xl shadow-xl mb-8 overflow-hidden text-white" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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

      <AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((card, index) => (
          <AnimatedSection key={index}>
            <Link to={card.link} className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-60 flex flex-col justify-end p-6 text-white transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group card-bg-image border-2 border-transparent hover:border-google-blue" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%), url(${card.imageUrl})` }}>
              <div className="relative z-10">
                <div className="mb-3 text-white">{card.icon}</div>
                <h3 className="font-bold text-xl mb-1">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default ArtisanDashboard;