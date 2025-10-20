import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection';
import StatCard from '../../components/artisan/StatCard';
import {
  SparklesIcon, ArchiveIcon, TrendingUpIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '../../components/common/Icons';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SkeletonStat from '../../components/ui/SkeletonStat';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MiniLineChart = ({ title, data, labels, icon, borderColor, bgColor }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        borderColor: borderColor || '#4285F4',
        backgroundColor: bgColor || 'rgba(66, 133, 244, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        displayColors: false,
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
        line: {
            borderWidth: 2
        }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
       <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            {icon && <span className="text-gray-400">{React.cloneElement(icon, { className: 'h-5 w-5' })}</span>}
       </div>
       <div className="flex-grow h-24 md:h-32">
            <Line options={options} data={chartData} />
       </div>
    </div>
  );
};


const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, lowInventory: 0 });
  const [salesData, setSalesData] = useState(null);
  const [viewsData, setViewsData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/dashboard/artisan-stats');

        if (isMounted) {
          setStats(data.stats);
          setSalesData(data.salesData);
          setViewsData(data.viewsData);
          setTopProducts(data.topProducts);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Could not load dashboard data. Please try again later.");
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

  if (loading || !user) {
    return (
      <div className="px-6 md:px-8 py-8 md:py-10">
        
        <div className="h-40 bg-gray-200 rounded-2xl shadow-xl mb-10 md:mb-12 animate-pulse"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-12">
          {[...Array(3)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <SkeletonCard className="h-40 md:h-48" />
                <SkeletonCard className="h-40 md:h-48" />
            </div>
            
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border animate-pulse">
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 py-2">
                             <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                             <div className="flex-1 space-y-2">
                                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-8 py-8 md:py-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="px-6 md:px-8 py-8 md:py-10">
      
      <AnimatedSection className="mb-10 pt-8 md:mb-12">
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

        
        <AnimatedSection className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
           
           {salesData && <MiniLineChart
                title="Sales (Last 7 Days)"
                labels={salesData.labels}
                data={salesData.data}
                icon={<CurrencyDollarIcon />}
                borderColor="#34A853"
                bgColor="rgba(52, 168, 83, 0.1)"
            />}
             
            {viewsData && <MiniLineChart
                title="Product Views (Last 7 Days)"
                labels={viewsData.labels}
                data={viewsData.data}
                icon={<EyeIcon />}
                borderColor="#4285F4"
                bgColor="rgba(66, 133, 244, 0.1)"
            />}
        </AnimatedSection>

        
        <AnimatedSection className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
            <h2 className="text-base font-medium text-gray-800 mb-4">Top Performing Products</h2>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <Link
                    to={`/artisan/products/edit/${product.id}`}
                    key={product.id}
                    className="flex items-center p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img src={product.images[0]?.url || 'https://placehold.co/40x40/cccccc/ffffff?text=P'} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.stats?.views || 0} Views</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-6">No product data available yet.</p>
              )}
            </div>
            
            {topProducts.length > 0 && (
                 <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                     <Link to="/artisan/analytics/products" className="text-sm font-medium text-google-blue hover:underline">
                         View all product performance
                     </Link>
                 </div>
             )}
          </div>
        </AnimatedSection>

      </div>
      
    </div>
  );
};

export default ArtisanDashboard;