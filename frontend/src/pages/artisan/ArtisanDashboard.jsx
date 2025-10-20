import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import api from '../../api/axiosConfig';          // Adjust path if needed
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed
import StatCard from '../../components/artisan/StatCard';       // Adjust path if needed
import {
  SparklesIcon, ArchiveIcon, TrendingUpIcon, // Keep used icons
  // Add new icons if needed for charts/lists (e.g., EyeIcon for views)
  EyeIcon, // Example: Add EyeIcon to Icons.jsx
  CurrencyDollarIcon // Example: Add CurrencyDollarIcon to Icons.jsx
} from '../../components/common/Icons';                       // Adjust path if needed
import SkeletonCard from '../../components/ui/SkeletonCard'; // Adjust path if needed
import SkeletonStat from '../../components/ui/SkeletonStat'; // Adjust path if needed
import SkeletonListItem from '../../components/ui/SkeletonListItem'; // Adjust path if needed

// --- Charting Imports ---
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
  Filler // Import Filler for area charts
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
// --- End Charting Imports ---

// --- Helper: Mini Chart Component ---
const MiniLineChart = ({ title, data, labels, icon, borderColor, bgColor }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        borderColor: borderColor || '#4285F4', // Default Google Blue
        backgroundColor: bgColor || 'rgba(66, 133, 244, 0.1)', // Light blue fill
        tension: 0.3, // Smoother curve
        fill: true, // Fill area below line
        pointRadius: 0, // Hide points
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: {
        mode: 'index',
        intersect: false,
        displayColors: false, // Hide color box in tooltip
      },
    },
    scales: {
      x: { display: false }, // Hide X axis labels/grid
      y: { display: false }, // Hide Y axis labels/grid
    },
    elements: {
        line: {
            borderWidth: 2 // Thinner line
        }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
       <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            {icon && <span className="text-gray-400">{React.cloneElement(icon, { className: 'h-5 w-5' })}</span>}
       </div>
       {/* Set explicit height for chart container */}
       <div className="flex-grow h-24 md:h-32">
            <Line options={options} data={chartData} />
       </div>
    </div>
  );
};
// --- End Mini Chart ---


const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, lowInventory: 0 });
  const [loading, setLoading] = useState(true);
  // Add state for chart data and top products if fetching dynamically
  // const [salesData, setSalesData] = useState([]);
  // const [viewsData, setViewsData] = useState([]);
  // const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, myProductsResponse /*, performanceData */] = await Promise.all([
          api.get('/orders'),
          api.get('/users/my-products'),
          // api.get('/dashboard/performance') // Example endpoint
        ]);

        if (isMounted) {
          const activeOrders = ordersResponse.data.orders.filter(order => ['pending', 'confirmed', 'processing', 'in_production'].includes(order.status));
          const lowStockItems = myProductsResponse.data.products.filter(p => !p.inventory.isUnlimited && p.inventory.quantity < 5);
          setStats({ orders: activeOrders.length, lowInventory: lowStockItems.length });
          // setSalesData(performanceData.data.sales);
          // setViewsData(performanceData.data.views);
          // setTopProducts(performanceData.data.topProducts);
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

  // --- Mock Data for Charts & Lists (Replace with fetched data) ---
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockSalesData = {
    labels: chartLabels,
    data: [12, 19, 3, 5, 2, 3, 9], // Example sales numbers
  };
   const mockViewsData = {
    labels: chartLabels,
    data: [30, 25, 40, 35, 50, 45, 60], // Example view numbers
  };
  const mockTopProducts = [
    { id: 'prod1', name: 'Hand-Painted Scarf', value: '55 Views', image: 'https://placehold.co/40x40/DB4437/FFFFFF?text=S', link: '/artisan/products/edit/prod1' },
    { id: 'prod2', name: 'Ceramic Vase', value: '48 Views', image: 'https://placehold.co/40x40/4285F4/FFFFFF?text=V', link: '/artisan/products/edit/prod2' },
    { id: 'prod3', name: 'Wooden Bowl Set', value: '35 Views', image: 'https://placehold.co/40x40/0F9D58/FFFFFF?text=W', link: '/artisan/products/edit/prod3' },
  ];
  // --- End Mock Data ---


  // --- Loading State ---
  if (loading || !user) {
    return (
      <div className="px-6 md:px-8 py-8 md:py-10">
        {/* Skeleton Header */}
        <div className="h-40 bg-gray-200 rounded-2xl shadow-xl mb-10 md:mb-12 animate-pulse"></div>
        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-12">
          {[...Array(3)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        {/* Skeleton for Charts & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skeleton Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <SkeletonCard className="h-40 md:h-48" />
                <SkeletonCard className="h-40 md:h-48" />
            </div>
            {/* Skeleton List */}
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

  // --- Main Return ---
  return (
    <div className="px-6 md:px-8 py-8 md:py-10">
      {/* --- Hero Section --- */}
      <AnimatedSection className="mb-10 md:mb-12">
        <div className="relative p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden text-white" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <header className="relative z-10 flex justify-center items-center text-center">
            {/* ... hero content ... */}
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

      {/* --- Stat Cards Section --- */}
      <AnimatedSection className="mb-10 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </AnimatedSection>

      {/* --- NEW SECTION: Performance Charts & Top List --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Mini Charts (Left/Center Columns) --- */}
        <AnimatedSection className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
           {/* Sales Chart */}
            <MiniLineChart
                title="Sales (Last 7 Days)"
                labels={mockSalesData.labels}
                data={mockSalesData.data}
                icon={<CurrencyDollarIcon />} // Example icon
                borderColor="#34A853" // Google Green
                bgColor="rgba(52, 168, 83, 0.1)"
            />
             {/* Views Chart */}
            <MiniLineChart
                title="Product Views (Last 7 Days)"
                labels={mockViewsData.labels}
                data={mockViewsData.data}
                icon={<EyeIcon />} // Example icon
                borderColor="#4285F4" // Google Blue
                bgColor="rgba(66, 133, 244, 0.1)"
            />
        </AnimatedSection>

        {/* --- Top Products List (Right Column) --- */}
        <AnimatedSection className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
            <h2 className="text-base font-medium text-gray-800 mb-4">Top Performing Products</h2>
            <div className="space-y-3">
              {mockTopProducts.length > 0 ? (
                mockTopProducts.map((product) => (
                  <Link
                    to={product.link || '#'}
                    key={product.id}
                    className="flex items-center p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.value}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-6">No product data available yet.</p>
              )}
            </div>
            {/* Optional: Link to full product analytics */}
            {mockTopProducts.length > 0 && (
                 <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                     <Link to="/artisan/analytics/products" className="text-sm font-medium text-google-blue hover:underline">
                         View all product performance
                     </Link>
                 </div>
             )}
          </div>
        </AnimatedSection>

      </div>
      {/* --- END NEW SECTION --- */}
    </div>
  );
};

export default ArtisanDashboard;