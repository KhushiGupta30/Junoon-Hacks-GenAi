import React, { useState, useEffect, useRef } from 'react';
// import { Link, NavLink } from 'react-router-dom'; // Removed
// import { useAuth } from '../../context/AuthContext'; // Removed

// --- ANIMATED SECTION COMPONENT (Keep) ---
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

// --- ICONS (Keep ones used by this page) ---
const TruckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM5 11h3v4H5v-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-5h-5" /></svg>);
const GlobeAltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9a9 9 0 009 9m-9-9h18" /></svg>);
const CubeTransparentIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>);
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-google-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-google-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);

// --- REMOVED ArtisanHeader component ---

// --- REMOVED Footer component ---


// --- MAIN LOGISTICS PAGE COMPONENT ---
const LogisticsPage = () => {
  // const { user, logout } = useAuth(); // Removed
  const [logisticsData, setLogisticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockLogisticsData = {
    featuredPartner: {
      name: "Blue Dart",
      summary: "A leading express air and integrated transportation & distribution company, offering secure and reliable delivery services.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Blue_Dart_logo.svg/2560px-Blue_Dart_logo.svg.png",
    },
    bestFitSuggestion: {
      scenario: "For a 250g fragile ceramic shipped from Delhi to Bangalore:",
      partner: "Delhivery",
      reason: "Offers specialized handling for fragile items at a competitive price point for this route.",
      cost: "Approx. ₹75",
      logo: "https://www.delhivery.com/wp-content/uploads/2021/06/delhivery-white-background-logo.png"
    },
    domesticPartners: [
      { id: 1, name: 'Delhivery', logo: 'https://www.delhivery.com/wp-content/uploads/2021/06/delhivery-white-background-logo.png', description: 'Known for its extensive network and technology-driven logistics solutions.', strengths: ['Wide Pin Code Coverage', 'COD Services', 'Reverse Logistics'], avgCostPer500g: '₹60 - ₹80', link: '#' },
      { id: 2, name: 'DTDC', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/DTDC_New_Logo_2022.jpg', description: 'One of India\'s largest integrated express and logistics players.', strengths: ['Large Franchisee Network', 'Value-Added Services'], avgCostPer500g: '₹55 - ₹75', link: '#' },
    ],
    internationalPartners: [
      { id: 1, name: 'DHL', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DHL_Logo.svg/2560px-DHL_Logo.svg.png', description: 'Global leader in the logistics industry, specializing in international shipping.', strengths: ['Express International Delivery', 'Reliable Tracking', 'Customs Clearance'], link: '#' },
      { id: 2, name: 'FedEx', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/1200px-FedEx_Express.svg.png', description: 'Provides a broad portfolio of transportation, e-commerce and business services.', strengths: ['Fast US & Europe delivery', 'Heavy Parcel Specialist'], link: '#' },
    ],
    packagingTips: [
      { title: "Use Double Boxing", description: "For fragile items, place a smaller box inside a larger one with cushioning in between." },
      { title: "Choose the Right Size", description: "A box that's too large increases shipping costs and the risk of damage." },
      { title: "Waterproof Your Items", description: "Wrap items in a plastic bag before boxing to protect against moisture." },
      { title: "Label Clearly", description: "Ensure the shipping label is secure, legible, and includes a return address." },
    ]
  };

  useEffect(() => {
    setLoading(true);
    // This uses mock data, but you would swap this for an API call
    const timer = setTimeout(() => {
      setLogisticsData(mockLogisticsData);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Simplified loading check
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="text-google-blue text-xl font-semibold">Simplifying your shipping...</div>
      </div>
    );
  }

  return (
    <>
      {/* <ArtisanHeader user={user} logout={logout} /> REMOVED */}

      {/* Page content wrapper with padding */}
      <div className="container mx-auto px-6 py-16">
        {/* --- HERO SECTION --- */}
        <AnimatedSection>
          <div className="relative p-8 rounded-2xl shadow-xl mb-16 overflow-hidden text-white bg-google-red">
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/topography.png')]"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8">

              {/* Left Text Section (Centered Vertically) */}
              <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Logistics & <span className="text-google-yellow">Shipping Hub</span>
                </h1>
                <p className="text-lg max-w-lg mx-auto lg:mx-0 text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Streamline your deliveries with our trusted partners and expert tips.
                </p>
              </div>

              {/* Fixed Height Featured Partner Card */}
              <div className="flex-shrink-0 w-64 lg:w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center text-center" style={{ minHeight: '240px' }}>
                <p className="text-sm font-semibold text-google-red uppercase tracking-wider mb-2">
                  Featured Partner
                </p>
                <img src={logisticsData.featuredPartner.logo} alt="Blue Dart Logo" className="h-10 object-contain my-2" />
                <p className="text-gray-600 text-sm mt-2">
                  {logisticsData.featuredPartner.summary}
                </p>
              </div>

            </div>
          </div>
        </AnimatedSection>


        {/* --- AI BEST FIT SUGGESTION --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-gray-50 p-8 rounded-2xl">
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center">
              <SparklesIcon />
              <h2 className="text-3xl font-bold mt-4 text-gray-800">AI Best Fit Suggestion</h2>
              <p className="text-gray-600 mt-2 text-sm max-w-xs">Our smart recommendation for your specific shipping needs.</p>
            </div>
            <div className="w-full lg:w-8/12 bg-white p-6 rounded-2xl shadow-lg border">
              <p className="text-gray-600 font-medium">{logisticsData.bestFitSuggestion.scenario}</p>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img src={logisticsData.bestFitSuggestion.logo} alt="Partner Logo" className="h-8 object-contain self-start sm:self-center" />
                <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pl-0 sm:pl-6 pt-4 sm:pt-0">
                  <p className="font-bold text-lg text-google-blue">{logisticsData.bestFitSuggestion.partner}</p>
                  <p className="text-sm text-gray-700 mt-1">{logisticsData.bestFitSuggestion.reason}</p>
                  <p className="text-sm font-semibold text-google-green mt-2">{logisticsData.bestFitSuggestion.cost}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* --- DOMESTIC SHIPPING PARTNERS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
            <div className="w-full lg:w-4/1T2 flex flex-col items-center text-center text-google-blue">
              <TruckIcon />
              <h2 className="text-3xl font-bold mt-4">Domestic Partners</h2>
              <p className="text-gray-600 mt-2 text-sm">Reliable delivery across India.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsData.domesticPartners.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-shadow flex flex-col">
                  <img src={p.logo} alt={p.name} className="h-8 object-contain self-start mb-3" />
                  <p className="text-sm text-gray-600 flex-grow">{p.description}</p>
                  <div className="mt-4 border-t pt-3 space-y-2">
                    {p.strengths.map(s => <div key={s} className="flex items-center gap-2 text-sm"><CheckIcon /><span>{s}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- INTERNATIONAL SHIPPING PARTNERS --- */}
        <AnimatedSection className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* THIS IS THE CORRECTED LINE */}
            <div className="w-full lg:w-4/12 flex flex-col items-center text-center text-google-green">
              <GlobeAltIcon />
              <h2 className="text-3xl font-bold mt-4">International Partners</h2>
              <p className="text-gray-600 mt-2 text-sm">Take your craft to the world.</p>
            </div>
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsData.internationalPartners.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition-shadow flex flex-col">
                  <img src={p.logo} alt={p.name} className="h-8 object-contain self-start mb-3" />
                  <p className="text-sm text-gray-600 flex-grow">{p.description}</p>
                  <div className="mt-4 border-t pt-3 space-y-2">
                    {p.strengths.map(s => <div key={s} className="flex items-center gap-2 text-sm"><CheckIcon /><span>{s}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- PACKAGING TIPS --- */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center text-gray-500">
              <CubeTransparentIcon />
            </div>
            <h2 className="text-3xl font-bold mt-4">Essential Packaging Tips</h2>
            <p className="text-gray-600 mt-2 text-sm">Protect your creations during transit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logisticsData.packagingTips.map(tip => (
              <div key={tip.title} className="bg-gray-50/80 border border-gray-200/80 p-5 rounded-xl text-center hover:bg-white hover:shadow-lg transition-all">
                <h3 className="font-bold text-gray-800">{tip.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
      {/* <Footer /> REMOVED */}
    </>
  );
};

export default LogisticsPage;