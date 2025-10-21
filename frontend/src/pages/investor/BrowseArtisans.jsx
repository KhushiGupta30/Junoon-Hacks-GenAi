import React, { useState, useEffect, useMemo, useRef } from 'react'; // Added useRef
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Adjust path if needed
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed

// --- ICONS (Defined locally, Google-style) ---
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ExclamationCircleIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.414l2.293 2.293a1 1 0 010 1.414L14 20l-2.293-2.293a1 1 0 010-1.414l4.586-4.586z" />
    </svg>
);

const LocationMarkerIcon = ({ className = "w-3 h-3" }) => ( // Smaller default for this page
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
// --- End Icons ---


// --- Skeleton Component Placeholders ---
const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-48" />;
const SkeletonArtisanCard = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center gap-4">
            <SkeletonBase className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <SkeletonBase className="h-5 w-3/4" />
                <SkeletonBase className="h-4 w-1/2" />
            </div>
        </div>
        <SkeletonBase className="h-9 w-full mt-4 rounded-md" />
    </div>
);
// --- End Skeletons ---

// --- Internal Artisan Card Component ---
const ArtisanCard = ({ artisan }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-google-blue/50 transition-all duration-200 flex flex-col h-full">
        <div className="flex items-center gap-4">
            <img src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${artisan.name.replace(' ','+')}&background=random`} alt={artisan.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"/>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-gray-800 truncate">{artisan.name}</h3>
                <p className="text-xs text-gray-500 truncate">{artisan.artisanProfile?.craftSpecialty?.join(', ') || 'Craftsman'}</p>
                 {artisan.artisanProfile?.location && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <LocationMarkerIcon className="w-3 h-3 text-gray-400"/> {artisan.artisanProfile.location}
                    </p>
                 )}
            </div>
        </div>
        <div className="mt-auto pt-4">
            <Link 
                to={`/investor/seller/${artisan.id}`} // Adjusted path to match your App.jsx
                className="block w-full text-center bg-google-blue text-white font-medium py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-colors shadow-sm"
            >
                View Profile & Invest
            </Link>
        </div>
    </div>
);

// --- MAIN BROWSE ARTISANS PAGE COMPONENT ---
const BrowseArtisans = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCraft, setFilterCraft] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    const [error, setError] = useState(null);

    // Mock data for filters and AI sidebar
    const craftOptions = ['All', 'Pottery', 'Textiles', 'Woodwork', 'Painting', 'Metalwork'];
    const locationOptions = ['All', 'Delhi', 'Mumbai', 'Jaipur', 'Kolkata'];
    const aiMatchedArtisans = artisans.slice(0, 2); // Example: show first 2 as "AI matched"

    useEffect(() => {
        const fetchArtisans = async () => {
            setLoading(true);
            try {
                // await new Promise(res => setTimeout(res, 1500)); // Simulate delay
                const response = await api.get('/users/artisans/uninvested');
                setArtisans(response.data.artisans || []);
            } catch (err) {
                setError("Could not fetch artisans. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtisans();
    }, []);

    const filteredArtisans = useMemo(() => {
        return artisans.filter(artisan => {
            const searchMatch = searchTerm === '' ||
                artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artisan.artisanProfile?.craftSpecialty?.join(' ').toLowerCase().includes(searchTerm.toLowerCase());

            const craftMatch = filterCraft === 'All' ||
                artisan.artisanProfile?.craftSpecialty?.includes(filterCraft);

            const locationMatch = filterLocation === 'All' ||
                artisan.artisanProfile?.location?.toLowerCase().includes(filterLocation.toLowerCase());

            return searchMatch && craftMatch && locationMatch;
        });
    }, [artisans, searchTerm, filterCraft, filterLocation]);

    // --- Loading State ---
    if (loading) {
        return (
             <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
                <div className="flex-grow space-y-8">
                    <SkeletonBase className="h-32 w-full mb-4"/> {/* Title & Filter Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => <SkeletonArtisanCard key={i} />)}
                    </div>
                </div>
                <div className="lg:w-80 flex-shrink-0 space-y-6">
                    <SkeletonSidebarCard />
                </div>
            </div>
        );
    }
    
    // --- Error State ---
    if (error) {
       return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
                 <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-medium text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600 text-sm mb-6">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10 px-6  bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
            
            {/* --- Main Content Area --- */}
            <div className="flex-grow lg:w-2/3">
                <AnimatedSection className="mb-8 text-center">
    <h1
        className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
        style={{
            background: 'linear-gradient(90deg, #6ddc65ff, #0F9D58)',
            color: '#f9fafcff'
        }}
    >
        Discover Artisans
    </h1>
    <p className="mt-3 text-gray-700 text-sm">
        Browse profiles of talented artisans and find opportunities to invest.
    </p>
</AnimatedSection>


                {/* --- Filter Bar --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
                    <div className="relative">
                        {/* FIXED ICON: Use component, apply classes */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                             <SearchIcon className="w-5 h-5" /> 
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or craft..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-google-blue focus:border-google-blue text-sm"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                         <div className="flex-1">
                            <label htmlFor="craftFilter" className="block text-xs font-medium text-gray-600 mb-1">Craft</label>
                            <select id="craftFilter" value={filterCraft} onChange={e => setFilterCraft(e.target.value)} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-google-blue focus:border-google-blue">
                                {craftOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="locationFilter" className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                            <select id="locationFilter" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-google-blue focus:border-google-blue">
                               {locationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- Artisan Grid --- */}
                 <AnimatedSection>
                    {filteredArtisans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Adjusted gap */}
                            {filteredArtisans.map(artisan => (
                                <ArtisanCard key={artisan.id} artisan={artisan} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
                             <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                                <SearchIcon className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-medium text-gray-700">No Artisans Found</h2>
                            <p className="text-gray-500 mt-2 text-sm">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                 </AnimatedSection>
            </div>

            {/* --- Right Sidebar --- */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start lg:mt-0">
                {/* --- AI Matched Artisans Card --- */}
                <AnimatedSection>
                    <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200/80">
                        <div className="flex items-center gap-2.5 mb-3">
                             <SparklesIcon className="h-5 w-5 text-google-blue" />
                             <h3 className="text-sm font-medium text-blue-900">AI Matched Artisans</h3>
                         </div>
                         <p className="text-xs text-gray-700 mb-4 leading-relaxed">
                             Based on your profile, these artisans might be a great investment fit.
                         </p>
                         <div className="space-y-3">
                            {aiMatchedArtisans.length > 0 ? aiMatchedArtisans.map(artisan => (
                                <Link to={`/seller/${artisan.id}`} key={artisan.id} className="block bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <img src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${artisan.name.replace(' ','+')}`} alt={artisan.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-gray-800 truncate">{artisan.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{artisan.artisanProfile?.craftSpecialty?.join(', ')}</p>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-xs text-gray-600 text-center py-4">No specific matches found right now.</p>
                            )}
                         </div>
                    </div>
                </AnimatedSection>
            </aside>
        </div>
    );
};

export default BrowseArtisans;