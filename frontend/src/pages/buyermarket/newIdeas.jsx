import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import {
  ThumbsUpIcon,
  LightbulbIcon,
  FilterIcon,
  ArrowDownUpIcon,
  Loader2,
  Search,
  Zap,
  Vote,
  PackageCheck,
  Layers,
  Users,
} from "lucide-react";
import Footer from "../../components/layout/Footer";

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

const IdeaCard = ({ idea }) => {
  const { token } = useAuth();
  const [voteStatus, setVoteStatus] = useState(null);
  const [currentUpvotes, setCurrentUpvotes] = useState(
    idea.votes?.upvotes || 0
  );
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);

  const handleVote = useCallback(async () => {
    if (voteStatus === "up" || isVoting) return;

    if (!token) {
      setVoteError("You must be logged in to vote.");
      return;
    }

    setIsVoting(true);
    setVoteStatus("pending");
    setVoteError(null);

    try {
      const response = await api.post(
        `/ideas/${idea._id}/vote`,
        { vote: "up" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUpvotes(response.data.votes.upvotes);
      setVoteStatus("up");
    } catch (err) {
      console.error("Failed to vote:", err);
      const message =
        err.response?.data?.message || "An error occurred while voting.";
      setVoteError(message);
      setVoteStatus(null); 
    } finally {
      setIsVoting(false);
    }
  }, [idea._id, voteStatus, isVoting, token]);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      y: -4,
      scale: 1.02,
      shadow:
        "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-shadow duration-300 flex flex-col h-full"
    >
      {}
      <div className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={
            idea.imageUrl ||
            "https://placehold.co/600x400/E2E8F0/AAAAAA?text=Idea"
          }
          alt={idea.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Error";
          }}
        />
      </div>

      {}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
          {idea.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          by{" "}
          {}
          <a
            href={`/buyer/seller/${idea.artisan?.id}`}
            className="hover:text-google-blue hover:underline"
          >
            {idea.artisan?.name || "Unknown Artisan"}
          </a>
          <span className="mx-1">&bull;</span> {idea.category}
        </p>
        <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-grow">
          {idea.description}
        </p>

        {}
        {voteError && <p className="text-xs text-red-600 mb-2">{voteError}</p>}

        {}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleVote}
            disabled={isVoting || voteStatus === "up"}
            className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
              voteStatus === "up"
                ? "bg-google-green/10 text-google-green"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label={`Vote for ${idea.title}`}
          >
            {isVoting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ThumbsUpIcon
                size={16}
                fill={voteStatus === "up" ? "currentColor" : "none"}
              />
            )}
            <span>{voteStatus === "up" ? "Voted!" : "Vote"}</span>
          </button>
          <p className="text-sm font-semibold text-gray-700">
            {currentUpvotes.toLocaleString()}{" "}
            <span className="text-xs font-normal text-gray-500">votes</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

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

const HowItWorks = () => {
  const steps = [
    {
      icon: Zap,
      title: "Discover Ideas",
      description:
        "Browse new designs and concepts submitted by talented artisans.",
      color: "blue",
    },
    {
      icon: Vote,
      title: "Cast Your Vote",
      description:
        "Upvote your favorite ideas to help artisans know what to create next.",
      color: "green",
    },
    {
      icon: PackageCheck,
      title: "See It Made",
      description:
        "The most popular ideas get prioritized and may become products you can buy!",
      color: "yellow",
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
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex space-x-4"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-google-${step.color}/10 text-google-${step.color}`}
            >
              <step.icon size={24} />{" "}
              {}
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const NewIdeasPage = () => {
  const categories = [
    "All",
    "Textiles",
    "Pottery",
    "Painting",
    "Woodwork",
    "Metalwork",
    "Sculpture",
    "Jewelry",
    "Other",
  ];
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("votes.upvotes");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalIdeas: 0,
  });

  const stats = useMemo(() => {
    const totalVotesOnPage = ideas.reduce(
      (acc, idea) => acc + (idea.votes?.upvotes || 0),
      0
    );
    const categoriesOnPage = new Set(ideas.map((idea) => idea.category));
    return {
      totalIdeas: pagination.totalIdeas,
      totalVotes: totalVotesOnPage,
      totalCategories: categoriesOnPage.size,
    };
  }, [ideas, pagination.totalIdeas]);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pagination.currentPage,
          limit: 12,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };

        if (filterCategory !== "All") {
          params.category = filterCategory;
        }

        const response = await api.get("/ideas", { params });

        setIdeas(response.data.ideas);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch ideas:", err);
        setError("Could not load ideas. Please try refreshing.");
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [filterCategory, sortBy, sortOrder, pagination.currentPage]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 },
  };

  const gridVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      className="font-sans bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {}
      <main className="pt-24 pb-16">
        {}
        <div className="container mx-auto px-6">
          {}
          {}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.1, duration: 0.5 },
            }}
            className="relative p-8 md:p-12 text-center mb-10 md:mb-12 rounded-2xl shadow-xl overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/2.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {}
            <div className="relative z-10">
              <LightbulbIcon className="w-12 h-12 text-google-yellow mx-auto mb-3" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                {" "}
                {}
                Shape the <span className="text-google-yellow">Future</span> of
                Craft
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
                {" "}
                {}
                Artisans are sharing their next big ideas. Vote for the designs
                you'd love to see brought to life!
              </p>
            </div>
          </motion.div>

          {}
          <HowItWorks />

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.5 },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-12"
          >
            <StatCard
              icon={LightbulbIcon}
              title="Total Ideas"
              value={stats.totalIdeas}
              color="blue"
            />
            <StatCard
              icon={ThumbsUpIcon}
              title="Total Votes Cast"
              value={stats.totalVotes.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={Layers}
              title="Categories"
              value={stats.totalCategories}
              color="yellow"
            />
          </motion.div>

          {}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.5, duration: 0.5 },
            }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Browse All Ideas
          </motion.h2>

          {}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.6, duration: 0.5 },
            }}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sortBySelect"
                className="text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                <Search size={18} className="text-gray-500" /> Sort by:
              </label>
              <select
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue"
                aria-label="Sort by"
              >
                <option value="votes.upvotes">Most Votes</option>
                <option value="createdAt">Newest First</option>
              </select>
              <button
                onClick={handleSortToggle}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                aria-label={`Sort ${
                  sortOrder === "asc" ? "descending" : "ascending"
                }`}
              >
                <ArrowDownUpIcon size={16} />
              </button>
            </div>
          </motion.div>

          {}
          {}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {[...Array(8)].map((_, i) => (
                  <SkeletonIdeaCard key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-500 bg-red-50 p-4 rounded-lg"
              >
                {error}
              </motion.p>
            ) : ideas.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-16"
              >
                No ideas found matching your filters. Try selecting 'All'
                categories.
              </motion.p>
            ) : (
              <motion.div
                key="data"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={gridVariants}
                initial="initial"
                animate="animate"
              >
                {ideas.map((idea) => (
                  <IdeaCard idea={idea} key={idea._id} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      {}
      <Footer />
    </motion.div>
  );
};

export default NewIdeasPage;
