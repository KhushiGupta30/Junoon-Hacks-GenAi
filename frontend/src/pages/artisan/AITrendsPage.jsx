import React, { useState, useEffect, useRef } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../api/axiosConfig'; // Adjust path if needed
// Import Shared Components & Icons
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed
import {
    SparklesIcon, // Used in Sidebar
    LightBulbIcon, // Used in Sidebar
    XIcon, // Used in Modal
    ExclamationCircleIcon, // For Error state
    ChartBarIcon, // NEW: For Category Chart Title
    ColorSwatchIcon // NEW: For Materials Chart Title
} from '../../components/common/Icons'; // Adjust path if needed

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Skeleton Component Placeholders ---
const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-44 md:h-48" />;
const SkeletonChartCard = () => <SkeletonBase className="h-64 md:h-80" />; // Larger for charts
const SkeletonTipItem = () => <SkeletonBase className="h-16 md:h-20" />;
// --- End Skeletons ---

// --- Chart Components (Modified Styling) ---
const CategoryChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.data,
            backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#7FBCFF', '#81C995'], // Added more colors
            borderRadius: 4,
            borderSkipped: false,
        }],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }, // Title moved outside chart component
            tooltip: {
                backgroundColor: '#333', // Darker tooltip
                titleFont: { weight: 'bold'},
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 4,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#E0E0E0', drawBorder: false }, // Lighter grid lines
                ticks: { font: { size: 10, family: 'Roboto' }, color: '#5F6368' } // Adjusted ticks
            },
            x: {
                 grid: { display: false },
                 ticks: { font: { size: 10, family: 'Roboto' }, color: '#5F6368' }
            }
        }
    };
    // Container with explicit height
    return <div className="h-64 md:h-80"><Bar options={options} data={chartData} /></div>;
};

const TrendingMaterialsChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.data,
            backgroundColor: ['#0F9D58', '#DB4437', '#4285F4', '#F4B400', '#AB47BC', '#FF7043'], // Added more colors
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom', // Legend at bottom
                labels: {
                    font: { size: 11, family: 'Roboto' },
                    color: '#5F6368',
                    boxWidth: 15,
                    padding: 15
                }
            },
            title: { display: false }, // Title moved outside chart component
             tooltip: {
                backgroundColor: '#333',
                titleFont: { weight: 'bold'},
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 4,
                // Use callbacks for better formatting if needed
            }
        },
        cutout: '60%' // Make doughnut thinner
    };
     // Container with explicit height
    return <div className="h-64 md:h-80"><Doughnut data={chartData} options={options} /></div>;
};
// --- End Chart Components ---


// --- Trend Detail Modal (Modified Styling) ---
const TrendDetailModal = ({ trend, onClose }) => {
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    const handleClose = () => { setShow(false); setTimeout(onClose, 300); };

    return (
        <div className={`fixed inset-0 z-[100] flex justify-center items-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'} bg-black/60`} onClick={handleClose}>
            <div className={`relative bg-white w-full max-w-lg rounded-xl shadow-xl p-6 md:p-8 transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"><XIcon className="w-5 h-5"/></button>
                <div className="flex flex-col items-center mb-4">
                    <div className="p-3 bg-yellow-100/70 rounded-full mb-3">
                         <SparklesIcon className="h-8 w-8 text-yellow-500" />
                    </div>
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Trend of the Month</p>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">{trend.title}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6 text-center">{trend.summary}</p>
                {/* Keywords styled as chips */}
                <div className="flex flex-wrap justify-center gap-2">
                    {trend.keywords.map((kw, idx) => (
                        <span key={idx} className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">{kw}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
// --- End Modal ---


const AITrendsPage = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Changed from null
  const [isTrendDetailOpen, setIsTrendDetailOpen] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      setError('');
      try {
        // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        const response = await api.get('/ai/trends');
        setTrends(response.data);
      } catch (err) {
        setError("Failed to load AI trends. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
        <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
             {/* Main Content Skeleton */}
            <div className="flex-grow space-y-8 md:space-y-10">
                <SkeletonBase className="h-10 w-3/4 mb-4"/> {/* Title Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <SkeletonChartCard/>
                   <SkeletonChartCard/>
                </div>
            </div>
            {/* Sidebar Skeleton */}
            <div className="lg:w-80 flex-shrink-0 space-y-6">
                <SkeletonSidebarCard />
                <SkeletonSidebarCard />
            </div>
       </div>
    );
  }

  // --- Error State ---
  if (error || !trends) {
     return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
            <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
            <h2 className="text-xl font-medium text-red-600 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 text-sm mb-6">{error || 'Could not load trend data.'}</p>
        </div>
      );
  }

  // --- Main Return (Loaded State) ---
  return (
    <>
      {/* Copied LogiPage outer div styling */}
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">

        {/* --- Main Content Area (Left/Top) --- */}
        <div className="flex-grow lg:w-2/3">
            {/* Page Title - Styled like LogiPage */}
            <AnimatedSection className="mb-8 md:mb-10 text-center">
    <h1
        className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
        style={{
            background: 'linear-gradient(90deg, #f66356ff, #DB4437)', 
            color: '#FFFFFF'
        }}
    >
        AI Trend Hub
    </h1>
    <p className="mt-3 text-gray-700 text-sm">
        Stay ahead with AI-driven insights for your craft business.
    </p>
</AnimatedSection>


            {/* --- Charts Section --- */}
            <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Demand Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <ChartBarIcon className="w-5 h-5 text-gray-500"/>
                        <h2 className="text-base font-medium text-gray-800">Trending Product Categories</h2>
                    </div>
                    <CategoryChart data={trends.categoryDemand} />
                </div>

                 {/* Trending Materials Chart */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center gap-2 mb-4">
                        <ColorSwatchIcon className="w-5 h-5 text-gray-500"/>
                        <h2 className="text-base font-medium text-gray-800">Trending Craft Materials</h2>
                    </div>
                    <TrendingMaterialsChart data={trends.trendingMaterials} />
                 </div>
            </AnimatedSection>
        </div>

        {/* --- Right Sidebar --- */}
        <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">

            {/* Trend of the Month Card */}
            <AnimatedSection>
                 {/* Styled like LogiPage sidebar cards */}
                 <div className="bg-yellow-50/60 p-5 rounded-xl border border-yellow-200/80 text-center">
                    <div className="inline-flex items-center gap-2 mb-2 bg-yellow-100/70 px-3 py-1 rounded-full">
                        <SparklesIcon className="h-4 w-4 text-yellow-600" />
                        <h3 className="text-xs font-semibold text-yellow-800 uppercase tracking-wider">Trend of the Month</h3>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mt-1 mb-3">{trends.trendOfMonth.title}</p>
                    <button
                        onClick={() => setIsTrendDetailOpen(true)}
                        className="w-full bg-white text-yellow-700 border border-yellow-300 font-medium py-1.5 rounded-lg hover:bg-yellow-100/70 transition-colors text-xs"
                    >
                       View Details
                    </button>
                </div>
            </AnimatedSection>

            {/* AI Actionable Tips Card */}
             <AnimatedSection>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <LightBulbIcon className="h-6 w-6 text-google-green" />
                        <h3 className="text-base font-medium text-gray-800">AI Recommendations</h3>
                     </div>
                     <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto"> {/* Max height */}
                         {trends.actionableTips.length > 0 ? trends.actionableTips.map((tip, idx) => (
                            <div key={idx} className="p-4 hover:bg-gray-50/70 transition-colors">
                                <h4 className="font-semibold text-sm text-gray-800">{tip.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                            </div>
                        )) : (
                             <p className="text-center text-gray-500 py-6 text-xs px-4">No specific recommendations available right now.</p>
                        )}
                    </div>
                      {/* Optional Footer Link */}
                    {/* <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                        <Link to="#" className="text-google-blue text-xs font-medium hover:underline">How are these generated?</Link>
                    </div> */}
                </div>
            </AnimatedSection>

        </aside>
      </div>

      {/* Trend Detail Modal */}
      {isTrendDetailOpen && (
        <TrendDetailModal
          trend={trends.trendOfMonth}
          onClose={() => setIsTrendDetailOpen(false)}
        />
      )}
    </>
  );
};

export default AITrendsPage;