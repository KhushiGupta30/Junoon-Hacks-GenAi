import React, { useState, useEffect, useMemo, useCallback } from "react";
// --- FIX: Replaced Link with a 'tag to avoid router context error ---
// We comment this out because the <Link> component was causing a crash.
// This page is likely being rendered without a <BrowserRouter> wrapper in your App.jsx or main.jsx
// Using a regular <a> tag will stop the crash, but it will cause a full page reload on click.
// The "correct" fix is to wrap your <App /> in <BrowserRouter> in main.jsx
// import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
// --- UPDATED: Added more icons for new components ---
import { ThumbsUpIcon, LightbulbIcon, FilterIcon, ArrowDownUpIcon, Loader2, Search, Zap, Vote, PackageCheck, Layers, Users } from 'lucide-react';
import Footer from "../../components/layout/Footer";

const dummyIdeas = [
  {
    id: '1',
    title: 'Hand-Woven Blue Silk Scarf',
    description: 'A beautiful silk scarf woven with traditional techniques, featuring a modern geometric pattern in shades of blue and silver.',
    category: 'Textiles',
    artisan: { id: 'a1', name: 'Rina Devi' },
    images: [{ url: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Silk+Scarf' }],
    votes: { upvotes: 120 },
    createdAt: '2025-10-27T10:00:00Z',
  },
  {
    id: '2',
    title: 'Ceramic Mugs (Set of 2)',
    description: 'Earthy ceramic mugs, hand-thrown and glazed with a unique speckled finish. Perfect for morning coffee.',
    category: 'Pottery',
    artisan: { id: 'a2', name: 'Suresh Kumar' },
    images: [{ url: 'https://placehold.co/600x400/8B4513/FFFFFF?text=Ceramic+Mugs' }],
    votes: { upvotes: 85 },
    createdAt: '2025-10-26T14:30:00Z',
  },
  {
    id: '3',
    title: 'Abstract "Jaipur" Canvas Painting',
    description: 'A vibrant abstract painting inspired by the colors of Jaipur. Acrylic on canvas, 24x36 inches.',
    category: 'Painting',
    artisan: { id: 'a3', name: 'Priya Singh' },
    images: [{ url: 'https://placehold.co/600x400/EF4444/FFFFFF?text=Abstract+Art' }],
    votes: { upvotes: 210 },
    createdAt: '2025-10-28T09:15:00Z',
  },
  {
    id: '4',
    title: 'Hand-Carved Teak Wood Box',
    description: 'Intricate floral carvings on a solid teak wood box. Ideal for storing jewelry or as a decorative piece.',
    category: 'Woodwork',
    artisan: { id: 'a4', name: 'Anil Mehta' },
    images: [{ url: 'https://placehold.co/600x400/A0522D/FFFFFF?text=Wood+Box' }],
    votes: { upvotes: 95 },
    createdAt: '2025-10-25T11:00:00Z',
  },
  {
    id: '5',
    title: 'Modern Brass Wall Sconce',
    description: 'A sleek and modern wall sconce made from hand-beaten brass, casting a warm, indirect light.',
    category: 'Metalwork',
    artisan: { id: 'a5', name: 'Farida Khan' },
    images: [{ url: 'https://placehold.co/600x400/F59E0B/FFFFFF?text=Brass+Sconce' }],
    votes: { upvotes: 150 },
    createdAt: '2025-10-28T11:00:00Z',
  },
  {
    id: '6',
    title: 'Terracotta Ganesha Idol',
    description: 'A miniature Ganesha idol sculpted from river clay, perfect for a desk or small nook. Eco-friendly and unpainted.',
    category: 'Sculpture',
    artisan: { id: 'a2', name: 'Suresh Kumar' },
    images: [{ url: 'https://placehold.co/600x400/F97316/FFFFFF?text=Ganesha+Idol' }],
    votes: { upvotes: 75 },
    createdAt: '2025-10-24T17:00:00Z',
  },
  {
    id: '7',
    title: 'Silver Jhumka Earrings',
    description: 'Traditional silver jhumka earrings with delicate filigree work and pearl accents. Lightweight and elegant.',
    category: 'Jewelry',
    artisan: { id: 'a6', name: 'Meena Kumari' },
    images: [{ url: 'https://placehold.co/600x400/9CA3AF/FFFFFF?text=Silver+Jhumka' }],
    votes: { upvotes: 180 },
    createdAt: '2025-10-27T16:00:00Z',
  },
  {
    id: '8',
    title: 'Block-Printed Cotton Table Runner',
    description: 'A hand block-printed table runner using natural dyes. Features a repeating paisley motif on soft cotton.',
    category: 'Textiles',
    artisan: { id: 'a1', name: 'Rina Devi' },
    images: [{ url: 'https://placehold.co/600x400/10B981/FFFFFF?text=Table+Runner' }],
    votes: { upvotes: 110 },
    createdAt: '2025-10-26T08:00:00Z',
  },
];


// --- Skeleton Card ---
const SkeletonIdeaCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-40 w-full"></div>
        <div className="p-4 space-y-3">
            <div className="bg-gray-200 h-5 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-3 w-1/2 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 w-full rounded"></div>
            <div className="bg-gray-200 h-3 w-5/6 rounded"></div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="bg-gray-200 h-8 w-20 rounded-md"></div>
                <div className="bg-gray-200 h-5 w-16 rounded"></div>
            </div>
        </div>
    </div>
);

// --- Idea Card Component ---
const IdeaCard = ({ idea }) => {
  // ... existing state ...
  const [voteStatus, setVoteStatus] = useState(null); // null, 'up', 'pending'
  const [currentUpvotes, setCurrentUpvotes] = useState(idea.votes?.upvotes || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);

  // --- MODIFIED: HandleVote with dummy logic ---
  const handleVote = useCallback(async () => {
    if (voteStatus === 'up' || isVoting) return;

    setIsVoting(true);
    setVoteStatus('pending');
    setVoteError(null);

    // Simulate network delay
    setTimeout(() => {
      // On success:
      setCurrentUpvotes(prevUpvotes => prevUpvotes + 1);
      setVoteStatus('up');
      setIsVoting(false);

      // --- To simulate an error, you could uncomment this: ---
      // setVoteError("Dummy error: Vote failed!");
      // setVoteStatus(null); // Revert status
      // setIsVoting(false);
      // setTimeout(() => setVoteError(null), 3000);
    }, 700);

  }, [idea.id, voteStatus, isVoting]);

  // --- Framer Motion variants for the card ---
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4, scale: 1.02, shadow: "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px" }
  };

  return (
    // --- Converted to motion.div and added variants ---
    <motion.div 
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={idea.images?.[0]?.url || 'https://placehold.co/600x400/E2E8F0/AAAAAA?text=Idea'}
          alt={idea.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Error'; }}
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{idea.title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          by{" "}
          {/* --- FIX: Replaced Link with <a> to avoid router context error --- */}
          <a href={`/buyer/seller/${idea.artisan?.id}`} className="hover:text-google-blue hover:underline">
            {idea.artisan?.name || 'Unknown Artisan'}
          </a>
           <span className="mx-1">&bull;</span> {idea.category}
        </p>
        <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-grow">{idea.description}</p>

        {/* --- FIX: Added error message display --- */}
        {voteError && (
          <p className="text-xs text-red-600 mb-2">{voteError}</p>
        )}

        {/* Voting Section */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleVote}
            disabled={isVoting || voteStatus === 'up'}
            className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
              voteStatus === 'up'
                ? 'bg-google-green/10 text-google-green'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Vote for ${idea.title}`}
          >
            {isVoting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
               <ThumbsUpIcon size={16} fill={voteStatus === 'up' ? 'currentColor' : 'none'} />
            )}
            <span>{voteStatus === 'up' ? 'Voted!' : 'Vote'}</span>
          </button>
          <p className="text-sm font-semibold text-gray-700">
            {currentUpvotes.toLocaleString()}{" "}
            <span className="text-xs font-normal text-gray-500">votes</span>
          </p>
        </div>
      </div>
    </motion.div> // --- End of motion.div ---
  );
};

// --- NEW: Stat Card Component ---
const StatCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  const colors = {
    blue: "text-google-blue bg-google-blue/10",
    green: "text-google-green bg-google-green/10",
    yellow: "text-google-yellow bg-google-yellow/10",
    red: "text-google-red bg-google-red/10",
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`rounded-full p-3 ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

// --- NEW: How It Works Component ---
const HowItWorks = () => {
  const steps = [
    { 
      icon: Zap, 
      title: 'Discover Ideas', 
      description: 'Browse new designs and concepts submitted by talented artisans.',
      color: 'blue'
    },
    { 
      icon: Vote, 
      title: 'Cast Your Vote', 
      description: 'Upvote your favorite ideas to help artisans know what to create next.',
      color: 'green'
    },
    { 
      icon: PackageCheck, 
      title: 'See It Made', 
      description: 'The most popular ideas get prioritized and may become products you can buy!',
      color: 'yellow'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
      className="mb-10 md:mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex space-x-4">
            <div className={`flex-shrink-0 rounded-full p-3 bg-${step.color}-100 text-${step.color}-600`}>
              <step.icon size={24} className={`text-google-${step.color}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


// --- Main Page Component ---
const NewIdeasPage = () => {
    // ... existing state ...
    const categories = [ "All", "Textiles", "Pottery", "Painting", "Woodwork", "Metalwork", "Sculpture", "Jewelry", "Other"];
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState("All");
    const [sortBy, setSortBy] = useState('votes'); // 'votes' or 'date'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    // --- NEW: Calculate stats from dummy data ---
    const stats = useMemo(() => {
      const totalVotes = dummyIdeas.reduce((acc, idea) => acc + (idea.votes?.upvotes || 0), 0);
      const categories = new Set(dummyIdeas.map(idea => idea.category));
      return {
        totalIdeas: dummyIdeas.length,
        totalVotes,
        totalCategories: categories.size
      };
    }, [dummyIdeas]);


    // --- MODIFIED: useEffect to use dummy data ---
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate network delay
        setTimeout(() => {
            try {
                // 1. Filter
                let filteredIdeas = dummyIdeas;
                if (filterCategory !== "All") {
                    filteredIdeas = dummyIdeas.filter(idea => idea.category === filterCategory);
                }

                // 2. Sort
                const sortedIdeas = [...filteredIdeas].sort((a, b) => {
                    let valA, valB;

                    if (sortBy === 'votes') {
                        valA = a.votes.upvotes;
                        valB = b.votes.upvotes;
                    } else { // 'date'
                        valA = new Date(a.createdAt);
                        valB = new Date(b.createdAt);
                    }

                    return sortOrder === 'desc' ? valB - valA : valA - valB;
                });
                
                setIdeas(sortedIdeas);

            } catch (err) {
                 console.error("Failed to process dummy data:", err);
                setError("Could not load ideas. Please try refreshing.");
                setIdeas([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        }, 1000); // 1 second delay

    }, [filterCategory, sortBy, sortOrder]); // Refetch when filters/sort change

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    // --- Framer Motion variants for the page and grid ---
    const pageVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.5 } },
      exit: { opacity: 0 }
    };

    const gridVariants = {
      animate: {
        transition: {
          staggerChildren: 0.05 // Stagger animation for each child
        }
      }
    };

    return (
        // --- Added page-level animation ---
        <motion.div 
          className="font-sans bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
            {/* Header is handled by BuyerLayout */}
            <main className="pt-24 pb-16">
                 {/* --- Removed AnimatedSection wrapper --- */}
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    {/* Hero Section */}
                        <motion.div 
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } }}
                         className="relative p-8 md:p-12 text-center mb-10 md:mb-12 rounded-2xl shadow-xl overflow-hidden" // <-- Added positioning and style classes
                         style={{
                         backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`, // <-- Added background image
                         backgroundSize: "cover",
                         backgroundPosition: "center",
                    }}
>
                        {/* This new div keeps content on top */}
                        <div className="relative z-10"> 
                      <LightbulbIcon className="w-12 h-12 text-google-yellow mx-auto mb-3" />
                      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3"> {/* <-- Changed text to white */}
                      Shape the <span className="text-google-yellow">Future</span> of Craft
                      </h1>
                      <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto"> {/* <-- Changed text to white/90 */}
                      Artisans are sharing their next big ideas. Vote for the designs you'd love to see brought to life!
                     </p>
                     </div>
                     </motion.div>

                    {/* --- NEW: How It Works Section --- */}
                    <HowItWorks />

                    {/* --- NEW: Stats Row --- */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-12"
                    >
                      <StatCard icon={LightbulbIcon} title="Total Ideas" value={stats.totalIdeas} color="blue" />
                      <StatCard icon={ThumbsUpIcon} title="Total Votes Cast" value={stats.totalVotes.toLocaleString()} color="green" />
                      <StatCard icon={Layers} title="Categories" value={stats.totalCategories} color="yellow" />
                    </motion.div>

                    {/* --- NEW: Title for the grid --- */}
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
                      className="text-2xl font-semibold text-gray-800 mb-4"
                    >
                      Browse All Ideas
                    </motion.h2>

                    {/* Filters and Sorting */}
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-2">
                                <FilterIcon size={18} className="text-gray-500" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue"
                                    aria-label="Filter by category"
                                >
                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="sortBySelect" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Search size={18} className="text-gray-500" /> Sort by:
                                 </label>
                                <select
                                    id="sortBySelect"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue"
                                    aria-label="Sort by"
                                >
                                    <option value="votes">Most Votes</option>
                                    <option value="date">Newest First</option>
                                </select>
                                <button onClick={handleSortToggle} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}>
                                    <ArrowDownUpIcon size={16}/>
                                </button>
                            </div>
                    </motion.div>

                    {/* Content Grid */}
                     {/* --- Added AnimatePresence for loading/error/data transitions --- */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => <SkeletonIdeaCard key={i} />)}
                            </motion.div>
                        ) : error ? (
                            <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</motion.p>
                        ) : ideas.length === 0 ? (
                             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-500 py-16">No ideas found matching your filters. Try selecting 'All' categories.</motion.p>
                        ) : (
                             // --- Added motion.div for staggered grid animation ---
                            <motion.div 
                              key="data"
                              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                              variants={gridVariants}
                              initial="initial"
                              animate="animate"
                            >
                                {ideas.map((idea) => (
                                    <IdeaCard idea={idea} key={idea.id || idea._id} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            {/* Footer is handled by BuyerLayout */}
            <Footer />
        </motion.div>
    );
};

export default NewIdeasPage;

