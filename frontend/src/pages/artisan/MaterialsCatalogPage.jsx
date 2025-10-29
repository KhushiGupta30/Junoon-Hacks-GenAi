import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Adjusted path
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjusted path
import {
    ArrowLeftIcon,
    BuildingStorefrontIcon,
    ArchiveIcon,
    SearchIcon,
    ExclamationCircleIcon,
    CollectionIcon,
    RefreshIcon,
    TagIcon,
} from '../../components/common/Icons'; // Adjusted path

// --- Skeleton Component ---
const SkeletonMaterialCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-40 w-full"></div>
        <div className="p-4 space-y-3">
            <div className="bg-gray-200 h-5 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-3 w-full rounded"></div>
            <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-8 w-full rounded-md mt-2"></div>
        </div>
    </div>
);
// --- End Skeleton ---

// --- Tab Button Component ---
const TabButton = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
            isActive ? 'text-google-blue font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-t-md'
        }`}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>}
    </button>
);

// --- Quick-search categories ---
const categories = [
  "Cotton Thread",
  "Silk Yarn",
  "Wool Fiber",
  "Bamboo Fiber",
  "Natural Dyes",
  "Embroidery Floss",
  "Linen Fabric",
  "Handloom Cotton",
  "Terracotta Clay",
  "Earthen Clay",
  "Stoneware Clay",
  "Glazing Powder",
  "Pottery Paints",
  "Ceramic Pigments",
  "Canvas Sheets",
  "Natural Pigments",
  "Acrylic Colors",
  "Oil Paints",
  "Brush Sets",
  "Wooden Frames",
  "Wooden Beads",
  "Teak Wood Blocks",
  "Sandalwood Pieces",
  "Plywood Sheets",
  "Varnish",
  "Carving Tools",
  "Brass Fittings",
  "Copper Wire",
  "Iron Rods",
  "Aluminum Sheets",
  "Silver Foil",
  "Metal Casting Powder",
  "Plaster of Paris",
  "Marble Dust",
  "Stone Blocks",
  "Clay Molds",
  "Chisels and Hammers",
  "Leather Scraps",
  "Cane",
  "Jute Rope",
  "Glass Beads",
  "Shell Pieces",
  "Silver Chains",
  "Gemstone Chips",
  "Recycled Paper",
  "Bamboo Sticks",
  "Natural Resin",
  "Organic Glue",
  "Lac Material",
];

// --- Catalog View Component ---
const CatalogBrowseView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeQuery, setActiveQuery] = useState("cotton");
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMaterials = async (isRefresh = false) => {
            if (!activeQuery) return;
            setLoading(true);
            setError("");
            try {
                const params = { q: activeQuery, refresh: isRefresh };
                const response = await api.get("/materials", { params });
                setMaterials(response.data || []); 
            } catch (err) {
                setError("Could not fetch materials. Please try again later.");
                console.error(err);
                setMaterials([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials(false);
    }, [activeQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setActiveQuery(searchTerm.trim());
        }
    };

    const handleCategoryClick = (category) => {
        setSearchTerm(category);
        setActiveQuery(category);
    };

    const handleRefresh = () => {
        if (activeQuery) {
            const fetchWithRefresh = async () => {
                setLoading(true);
                setError("");
                try {
                    const params = { q: activeQuery, refresh: true };
                    const response = await api.get("/materials", { params });
                    setMaterials(response.data || []);
                } catch (err) {
                    setError("Could not fetch materials. Please try again later.");
                    console.error(err);
                    setMaterials([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchWithRefresh();
        }
    };

    return (
        <AnimatedSection>
            {/* --- Search Bar & Filters --- */}
            <div className="mb-6 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for 'jute rope', 'brass fittings', etc."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                        />
                        <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-google-blue text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                        Search
                    </button>
                    <button type="button" onClick={handleRefresh} disabled={loading} title="Refresh results" className="p-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                        <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </form>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => handleCategoryClick(cat)} className="flex items-center gap-1.5 px-3 py-1 bg-white text-xs font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors">
                            <TagIcon className="h-3 w-3 text-gray-500" />
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Results Grid --- */}
            <div>
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <SkeletonMaterialCard key={i} />)}
                    </div>
                )}
                {!loading && error && (
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center flex flex-col items-center justify-center min-h-[200px]">
                        <ExclamationCircleIcon className="h-10 w-10 text-red-400 mb-3" />
                        <h3 className="font-medium text-sm text-red-700">Oops! Something went wrong.</h3>
                        <p className="text-xs text-red-600 mt-1 px-4">{error}</p>
                    </div>
                )}
                {!loading && !error && materials.length === 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center min-h-[200px]">
                        <SearchIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <h3 className="font-medium text-sm text-gray-700">No Results Found</h3>
                        <p className="text-xs text-gray-500 mt-1 px-4">Try adjusting your search terms or selecting a different category.</p>
                    </div>
                )}
                {!loading && !error && materials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {materials.map((item, index) => (
                            <div key={item.link + index} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <img src={item.image} alt={item.title} className="h-40 w-full object-cover border-b border-gray-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200.png?text=Image+Not+Found'; }}/>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2" title={item.title}>{item.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 flex-grow">{item.snippet}</p>
                                    
                                    <div className="mt-4">
                                        {/* --- THIS IS THE ONLY CHANGE: PRICE DISPLAY --- */}
                                        {item.price && (
                                            <p className="text-lg font-bold text-google-green mb-2">
                                                {item.price}
                                            </p>
                                        )}
                                        
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-google-blue/10 text-google-blue text-xs font-bold py-2 rounded-md hover:bg-google-blue/20 transition-colors">
                                            View on IndiaMART
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AnimatedSection>
    );
};

// --- Placeholder for Order History View ---
const OrderHistoryView = () => (
    <AnimatedSection>
        <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
            <ArchiveIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Order History</h3>
            <p className="text-gray-500 mt-2 text-sm">
                This is where you will build the "My Order History" list.
            </p>
        </div>
    </AnimatedSection>
);

// --- MAIN MATERIALS CATALOG PAGE ---
const MaterialsCatalogPage = () => {
    const [activeTab, setActiveTab] = useState('catalog');

    return (
        <div className="px-6 md:px-8 py-8 md:py-15 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
            <AnimatedSection className="mb-8">
                <Link
                    to="/artisan/logistics"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Logistics
                </Link>
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                    Materials Marketplace
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Browse, order, and track your ethically sourced materials.
                </p>
            </AnimatedSection>

            <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    <TabButton title="Browse Catalog" isActive={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} />
                    <TabButton title="My Order History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </div>
            </div>

            <div>
                {activeTab === 'catalog' && <CatalogBrowseView />}
                {activeTab === 'history' && <OrderHistoryView />}
            </div>
        </div>
    );
};

export default MaterialsCatalogPage;