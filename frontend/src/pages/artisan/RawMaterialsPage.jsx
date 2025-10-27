import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig"; // Adjusted path
import AnimatedSection from "../../components/ui/AnimatedSection"; // Adjusted path
import {
  SearchIcon,
  ExclamationCircleIcon,
  CollectionIcon, // Using this for "Browse Catalog"
  RefreshIcon,
  TagIcon, // For categories
} from "../../components/common/Icons"; // Adjusted path

// --- Skeleton Component (Styled like your other pages) ---
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

// Quick-search categories
const categories = [
  // Textiles
  "Cotton Thread",
  "Silk Yarn",
  "Wool Fiber",
  "Bamboo Fiber",
  "Natural Dyes",
  "Embroidery Floss",
  "Linen Fabric",
  "Handloom Cotton",

  // Pottery
  "Terracotta Clay",
  "Earthen Clay",
  "Stoneware Clay",
  "Glazing Powder",
  "Pottery Paints",
  "Ceramic Pigments",

  // Painting
  "Canvas Sheets",
  "Natural Pigments",
  "Acrylic Colors",
  "Oil Paints",
  "Brush Sets",
  "Wooden Frames",

  // Woodwork
  "Wooden Beads",
  "Teak Wood Blocks",
  "Sandalwood Pieces",
  "Plywood Sheets",
  "Varnish",
  "Carving Tools",

  // Metalwork
  "Brass Fittings",
  "Copper Wire",
  "Iron Rods",
  "Aluminum Sheets",
  "Silver Foil",
  "Metal Casting Powder",

  // Sculpture
  "Plaster of Paris",
  "Marble Dust",
  "Stone Blocks",
  "Clay Molds",
  "Chisels and Hammers",

  // Jewelry
  "Leather Scraps",
  "Cane",
  "Jute Rope",
  "Glass Beads",
  "Shell Pieces",
  "Silver Chains",
  "Gemstone Chips",

  // Misc / Other
  "Recycled Paper",
  "Bamboo Sticks",
  "Natural Resin",
  "Organic Glue",
  "Lac Material",
];


const RawMaterialPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuery, setActiveQuery] = useState("artisan craft supplies"); // Default search
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch materials whenever activeQuery changes
  useEffect(() => {
    const fetchMaterials = async (isRefresh = false) => {
      if (!activeQuery) return;

      setLoading(true);
      setError("");
      try {
        const params = {
          q: activeQuery,
          refresh: isRefresh,
        };
        const response = await api.get("/materials", { params });
        setMaterials(response.data);
      } catch (err) {
        setError("Could not fetch materials. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials(false);
  }, [activeQuery]); // Re-run on activeQuery change

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
      // Re-run the effect with a "refresh=true" flag
      const fetchWithRefresh = async () => {
        setLoading(true);
        setError("");
        try {
          const params = { q: activeQuery, refresh: true };
          const response = await api.get("/materials", { params });
          setMaterials(response.data);
        } catch (err) {
          setError("Could not fetch materials. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchWithRefresh();
    }
  };

  return (
    // Use the same gradient background as GrantsPage
    <div className="flex flex-col gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      
      {/* --- Page Header --- */}
      <AnimatedSection className="mb-4">
        <div className="flex items-center gap-3 mb-2 px-1">
          <CollectionIcon className="h-7 w-7 text-google-blue" />
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
            Browse Raw Materials
          </h1>
        </div>
        <p className="text-sm text-gray-600 mb-6 px-1">
          Find suppliers for threads, clay, wood, and more from IndiaMART.
        </p>

        {/* --- Search Bar --- */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2"
        >
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
          <button
            type="submit"
            className="px-5 py-2.5 bg-google-blue text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh results"
            className="p-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>

        {/* --- Category Buttons --- */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-xs font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors"
            >
              <TagIcon className="h-3 w-3 text-gray-500" />
              {cat}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* --- Results Grid --- */}
      <AnimatedSection>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonMaterialCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center flex flex-col items-center justify-center min-h-[200px]">
            <ExclamationCircleIcon className="h-10 w-10 text-red-400 mb-3" />
            <h3 className="font-medium text-sm text-red-700">
              Oops! Something went wrong.
            </h3>
            <p className="text-xs text-red-600 mt-1 px-4">{error}</p>
          </div>
        )}

        {!loading && !error && materials.length === 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center min-h-[200px]">
            <SearchIcon className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="font-medium text-sm text-gray-700">
              No Results Found
            </h3>
            <p className="text-xs text-gray-500 mt-1 px-4">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}

        {!loading && !error && materials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((item, index) => (
              <div
                key={item.link + index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 w-full object-cover border-b border-gray-100"
                  onError={(e) => {
                    // Fallback if the linked image is broken
                    e.target.src = 'https://via.placeholder.com/300x200.png?text=Image+Not+Found';
                  }}
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 flex-grow">
                    {item.snippet}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full block text-center bg-google-blue/10 text-google-blue text-xs font-bold py-2 rounded-md hover:bg-google-blue/20 transition-colors"
                  >
                    View on IndiaMART
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default RawMaterialPage;