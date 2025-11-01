import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  LightBulbIcon,
  ExclamationCircleIcon,
  HistoryIcon,
  ArrowLeftIcon,
  FilterIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  ThumbUpIcon,
  XIcon,
  ChatAltIcon,
  PlusCircleIcon,
  SparklesIcon, 
} from "../../components/common/Icons";
import IdeaDetailModal from "../../components/modal/IdeaDetailModal";

const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-64" />;
const SkeletonForm = () => <SkeletonBase className="h-[40rem]" />;
const timeAgo = (date) => {
  if (!date) return "someday ago";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "min ago";
  return "Just now";
};
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm" />
  </div>
);
const FormSelect = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm">{children}</select>
  </div>
);


const IdeaSubmissionFormFields = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [imageGenError, setImageGenError] = useState('');

  const categories = [
    "Pottery", "Textiles", "Painting", "Woodwork", "Metalwork", "Sculpture", "Jewelry", "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleGenerateImage = async () => {
    if (!formData.title || !formData.description) {
      setImageGenError("Please provide a title and description first.");
      return;
    }
    setIsGeneratingImage(true);
    setImageGenError('');
    setGeneratedImageUrl('');

    try {
      const detailedPrompt = `High-quality e-commerce product photo of a handmade ${formData.category} item: ${formData.title}. ${formData.description}. Neutral background, studio lighting.`;
      const response = await api.post('/ai/generate-image-native', { prompt: detailedPrompt });
      setGeneratedImageUrl(response.data.imageUrl);

    } catch (err) {
      console.error("AI Image Generation Error:", err);
      setImageGenError(err.response?.data?.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        imageUrl: generatedImageUrl, 
        status: "published",
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6"
    >
      {error && (
        <div className="text-red-700 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <FormInput
          label="Idea Title"
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Self-Watering Terracotta Planters"
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Detailed Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe your idea. What makes it unique? What materials would you use? What's the story behind it?"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm"
          ></textarea>
        </div>

        <FormSelect
          label="Category"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </FormSelect>
      </div>

      {/* --- START: NEW IMAGE GENERATION UI --- */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Generate a Concept Image (Optional)</h3>
        <p className="text-xs text-gray-500">Based on your title and description, our AI can create a visual concept to help get votes. This can take up to 30 seconds.</p>
        <button
          type="button"
          onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-google-blue px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-wait transition-colors"
        >
          <SparklesIcon className={`w-5 h-5 ${isGeneratingImage ? 'animate-spin' : ''}`} />
          {isGeneratingImage ? 'Generating Image...' : 'Generate with AI'}
        </button>

        {imageGenError && <p className="text-red-600 text-sm mt-2">{imageGenError}</p>}

        {isGeneratingImage && (
          <div className="mt-4 flex flex-col items-center justify-center w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed">
            <p className="text-sm text-gray-500">Creating...</p>
          </div>
        )}

        {generatedImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">AI Generated Preview:</p>
            <img
              src={generatedImageUrl}
              alt="AI generated concept"
              className="w-48 h-48 object-cover rounded-lg border-2 border-google-blue shadow-md"
            />
          </div>
        )}
      </div>
      {/* --- END: NEW IMAGE GENERATION UI --- */}

      <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate("/artisan/dashboard")}
          className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors text-sm flex items-center gap-1.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-google-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {loading ? "Submitting..." : "Submit for Review"}
        </button>
      </div>
    </form>
  );
};

const IdeaSubmissionPage = ({ }) => {
  const navigate = useNavigate();
  const [recentIdeas, setRecentIdeas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedIdea, setSelectedIdea] = useState(null);

  const categoriesForFilter = [
    "All", "Pottery", "Textiles", "Painting", "Woodwork", "Metalwork", "Sculpture", "Jewelry", "Other",
  ];

  useEffect(() => {
    const fetchRecentIdeas = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/ideas");
        const ideasFromApi = response.data.ideas;
        const formattedIdeas = ideasFromApi.map((idea) => {
          const submittedAtDate = new Date(idea.submittedAt || idea.createdAt);
          const votes = idea.votes ? idea.votes.upvotes || 0 : 0;
          return {
            ...idea,
            submittedAt: submittedAtDate,
            time: timeAgo(submittedAtDate),
            votes: votes,
            link: "#",
          };
        });
        setRecentIdeas(formattedIdeas);
      } catch (err) {
        console.error("Failed to fetch recent ideas:", err);
        setError("Could not load recent ideas.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentIdeas();
  }, []);

  const displayedIdeas = useMemo(() => {
    if (!recentIdeas) return [];
    let filtered = [...recentIdeas];
    if (filterCategory !== "All") {
      filtered = filtered.filter((idea) => idea.category === filterCategory);
    }
    filtered.sort((a, b) => {
      let comparison =
        sortBy === "votes"
          ? a.votes - b.votes
          : a.submittedAt.getTime() - b.submittedAt.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return filtered;
  }, [recentIdeas, filterCategory, sortBy, sortOrder]);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await api.post("/ideas", formData);
      const createdIdea = response.data.idea;
      const newIdea = {
        id: createdIdea.id,
        title: createdIdea.title,
        category: createdIdea.category,
        description: createdIdea.description,
        time: "Just now",
        submittedAt: new Date(),
        votes: 0,
        link: "#",
      };
      setRecentIdeas((prev) => [newIdea, ...(prev || [])].slice(0, 5));
      navigate("/artisan/dashboard");
    } catch (err) {
      console.error("Failed to submit idea:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Failed to submit. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const openIdeaModal = (idea) => {
    setSelectedIdea(idea);
  };
  const handleAddToProducts = (ideaData) => {
    navigate("/artisan/products/new", {
      state: {
        ideaData: {
          name: ideaData.title,
          description: ideaData.description,
          category: ideaData.category,
        },
      },
    });
  };

  if (loading && !recentIdeas) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
        <div className="flex-grow space-y-8">
          <SkeletonBase className="h-10 w-3/4 mb-4" />
          <SkeletonForm />
        </div>
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <SkeletonSidebarCard />
        </div>
      </div>
    );
  }

  if (error && !recentIdeas) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
        <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-6">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        <div className="flex-grow lg:w-2/3">
          <AnimatedSection>
            <div className="text-center mb-8 pt-8">
              <h1
                className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
                style={{
                  background: "linear-gradient(90deg, #70d969ff, #0F9D58)",
                  color: "#fbfcfeff",
                }}
              >
                Submit a New Idea
              </h1>
              <p className="mt-3 text-gray-700 text-sm">
                Share your next masterpiece for community feedback.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <IdeaSubmissionFormFields onSubmit={handleFormSubmit} />
          </AnimatedSection>
        </div>
        <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
          <AnimatedSection>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <HistoryIcon className="h-6 w-6 text-gray-500" />
                  <h3 className="text-base font-medium text-gray-800 whitespace-nowrap">
                    Recent Ideas
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue"
                    aria-label="Filter by category"
                  >
                    {categoriesForFilter.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue"
                    aria-label="Sort by"
                  >
                    <option value="date">Date</option>
                    <option value="votes">Votes</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    className="p-1 rounded hover:bg-gray-100 text-gray-500"
                    aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"
                      }`}
                  >
                    {sortOrder === "asc" ? (
                      <SortAscendingIcon className="w-4 h-4" />
                    ) : (
                      <SortDescendingIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {loading && !recentIdeas ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    Loading ideas...
                  </div>
                ) : displayedIdeas.length > 0 ? (
                  displayedIdeas.map((idea) => (
                    <button
                      key={idea.id}
                      onClick={() => openIdeaModal(idea)}
                      className="block w-full text-left p-4 hover:bg-gray-50/70 transition-colors focus:outline-none focus:bg-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm text-gray-800 leading-snug flex-1 pr-2">
                          {idea.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <ThumbUpIcon className="w-3 h-3 text-gray-400" />
                          <span>{idea.votes}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {idea.category}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {idea.time}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  !error && (
                    <p className="text-center text-gray-500 py-6 text-xs px-4">
                      No ideas match your filters.
                    </p>
                  )
                )}
              </div>
              {recentIdeas && recentIdeas.length > 0 && (
                <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                  <Link
                    to="/artisan/ideas"
                    className="text-google-blue text-xs font-medium hover:underline"
                  >
                    View all submitted ideas
                  </Link>
                </div>
              )}
            </div>
          </AnimatedSection>
        </aside>
      </div>
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onAddToProducts={handleAddToProducts}
        />
      )}
    </>
  );
};

export default IdeaSubmissionPage;