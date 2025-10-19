import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../context/AuthContext'; // No longer needed here
// Link, NavLink, MenuIcon, XIcon, LogoutIcon removed as Header is gone
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../api/axiosConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Page-Specific Components (Keep These) ---

const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = ref.current; // Capture ref value
    if (currentRef) observer.observe(currentRef);
    
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-google-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.516l.153-.352c.2-.463.6-.78 1.084-.78h.548c.552 0 1 .448 1 1v13.586a1 1 0 01-1.707.707l-3.585-3.585A4.008 4.008 0 0113 13H5.436z" />
    </svg>
);

// XIcon is used by the modal, so we keep it
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);


// --- REMOVED ArtisanHeader component ---

// --- REMOVED Footer component ---

const CategoryChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Demand by Category (%)',
            data: data.data,
            backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
            borderRadius: 5,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Trending Product Categories', font: { size: 16 } },
        },
        scales: { y: { beginAtZero: true } }
    };
    return <Bar options={options} data={chartData} />;
};

const TrendingMaterialsChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Popularity',
            data: data.data,
            backgroundColor: ['#0F9D58', '#DB4437', '#4285F4', '#F4B400'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Trending Craft Materials', font: { size: 16 } },
        }
    };
    return <Doughnut data={chartData} options={options} />;
};


const TrendDetailModal = ({ trend, onClose }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex justify-center items-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={handleClose}
        >
            <div
                className={`relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                    <XIcon />
                </button>
                <div className="flex items-center justify-center mb-4">
                    <SparklesIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{trend.title}</h2>
                <p className="text-center text-sm font-semibold text-google-blue uppercase tracking-wider mb-4">
                    Trend of the Month
                </p>
                <p className="text-gray-600 text-base mb-6 text-center">{trend.summary}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {trend.keywords.map((kw, idx) => (
                        <span key={idx} className="text-sm font-medium bg-gray-200 text-gray-800 px-3 py-1 rounded-full">{kw}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AITrendsPage = () => {
  // const { user, logout } = useAuth(); // Removed
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTrendDetailOpen, setIsTrendDetailOpen] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
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

  // Simplified loading check. ProtectedRoute handles the !user case.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gray-100">
        <div className="text-google-blue text-xl font-semibold">Analyzing Latest Trends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gray-100">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* <ArtisanHeader user={user} logout={logout} /> REMOVED */}
      
      {/* The <main> tag is no longer needed, as ArtisanLayout has one.
        We just return the page content directly.
        The pt-24 padding is also gone, as it's on the layout's <main> tag.
      */}
      <div className="container mx-auto px-6 py-16">
        <AnimatedSection>
          <div
            className="relative p-8 rounded-2xl shadow-xl mb-12 overflow-hidden text-white bg-google-blue"
          >
            <div className="absolute inset-0 z-0 opacity-20">
              <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern-circles-dash" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1.5" fill="#fff" opacity="0.1"></circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-circles-dash)"></rect>
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  AI-Powered <span className="text-google-yellow">Trend Hub</span>
                </h1>
                <p className="text-lg max-w-lg mx-auto lg:mx-0 text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Stay ahead of the curve with AI-driven insights to grow your craft business.
                </p>
              </div>

              <div
                 onClick={() => setIsTrendDetailOpen(true)}
                 className="flex-shrink-0 w-64 lg:w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <SparklesIcon />
                </div>
                <p className="text-sm font-semibold text-google-blue uppercase tracking-wider text-center mb-2">
                  Trend of the Month
                </p>
                <h3 className="text-lg font-bold text-gray-800 text-center">{trends.trendOfMonth.title}</h3>
                <p className="text-gray-500 text-sm mt-4 text-center italic">Click to see details</p>
              </div>
              
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12 flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-green">
              <MegaphoneIcon />
              <h2 className="text-3xl font-bold mt-4">AI-Driven Recommendations</h2>
              <p className="text-gray-600 mt-2 text-sm">Actionable tips to help you succeed.</p>
          </div>
          <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.actionableTips.map((tip, idx) => (
              <div key={idx} className="relative bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-transform transform hover:-translate-y-1">
                <div className="absolute -top-3 -right-3 text-google-green opacity-20">
                  <LightBulbIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-center items-center">
            <CategoryChart data={trends.categoryDemand} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-center items-center">
            <TrendingMaterialsChart data={trends.trendingMaterials} />
          </div>
        </AnimatedSection>
      </div>

      {isTrendDetailOpen && (
        <TrendDetailModal
          trend={trends.trendOfMonth}
          onClose={() => setIsTrendDetailOpen(false)}
        />
      )}
      
      {/* <Footer /> REMOVED */}
    </>
  );
};

export default AITrendsPage;