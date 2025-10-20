import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Adjust path if needed
// Import Shared Components & Icons
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed
import {
    LightBulbIcon,
    ExclamationCircleIcon, // For error states
    HistoryIcon, // For sidebar
    ArrowLeftIcon, // For cancel button - MAKE SURE THIS IS IN Icons.jsx
    FilterIcon,     // New
    SortAscendingIcon, // New
    SortDescendingIcon, // New
    ThumbUpIcon,       // New
    XIcon, // For Modal
    ChatAltIcon,    // For Modal Comments - MAKE SURE THIS IS IN Icons.jsx
    PlusCircleIcon  // For Modal Add Button - MAKE SURE THIS IS IN Icons.jsx
} from '../../components/common/Icons'; // Adjust path if needed
// Import Modal
import IdeaDetailModal from '../../components/modal/IdeaDetailModal'; // Adjust path if needed

// --- Skeleton Component Placeholders ---
const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-64" />; // Taller for list
const SkeletonForm = () => <SkeletonBase className="h-[40rem]" />; // Tall form skeleton
// --- End Skeletons ---

// --- INTERNAL FORM FIELDS COMPONENT ---
const IdeaSubmissionFormFields = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Other' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            {error && <div className="text-red-700 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-200">{error}</div>}

            <div className="space-y-6">
                <FormInput label="Idea Title" id="title" name="title" type="text" value={formData.title} onChange={handleChange} required placeholder="e.g., Self-Watering Terracotta Planters" />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Describe your idea. What makes it unique? What materials would you use? What's the story behind it?" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm"></textarea>
                </div>

                <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </FormSelect>
            </div>

            <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => navigate('/artisan/dashboard')} className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors text-sm flex items-center gap-1.5">
                   {/* Optional: <ArrowLeftIcon className="w-4 h-4" /> */} Cancel
                </button>
                <button type="submit" disabled={loading} className="bg-google-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2">
                    {loading && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </form>
    );
};
// --- End Form Fields ---


// --- MAIN PAGE COMPONENT (Styled like LogiPage) ---
const IdeaSubmissionPage = () => {
    const navigate = useNavigate();
    const [recentIdeas, setRecentIdeas] = useState(null); // State for sidebar
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Added error state for fetching recent ideas
    const [sortBy, setSortBy] = useState('date'); // 'date', 'votes'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [filterCategory, setFilterCategory] = useState('All'); // 'All', 'Pottery', etc.
    const [selectedIdea, setSelectedIdea] = useState(null); // <-- State for modal

    // Mock data for the sidebar - ADDED VOTES & DESCRIPTION
    const mockRecentIdeas = [
        { id: 'idea1', title: 'Modular Wooden Shelving Unit', category: 'Woodwork', time: '2h ago', submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), votes: 15, description: "A versatile shelving system made from sustainable bamboo.", link: '#' },
        { id: 'idea2', title: 'Hand-Dyed Shibori Throw Pillows', category: 'Textiles', time: 'Yesterday', submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), votes: 8, description: "Organic cotton pillows dyed using traditional Japanese Shibori techniques.", link: '#' },
        { id: 'idea3', title: 'Minimalist Ceramic Dinnerware Set', category: 'Pottery', time: '3d ago', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), votes: 22, description: "Simple, elegant stoneware plates and bowls with a matte glaze.", link: '#' },
        { id: 'idea4', title: 'Upcycled Metal Sculpture', category: 'Metalwork', time: '5d ago', submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), votes: 5, description: "Abstract sculpture created from reclaimed industrial metal parts.", link: '#' },
    ];

    const categoriesForFilter = ['All', 'Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other']; // For filter dropdown

    // ... (useEffect for data fetching) ...
    useEffect(() => {
        const fetchRecentIdeas = async () => {
            setLoading(true);
            setError('');
            try {
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                setRecentIdeas(mockRecentIdeas);
            } catch (err) {
                console.error("Failed to fetch recent ideas:", err);
                setError("Could not load recent ideas.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecentIdeas();
    }, []);

    // ... (useMemo for sorting/filtering) ...
    const displayedIdeas = useMemo(() => {
        if (!recentIdeas) return [];
        let filtered = [...recentIdeas];
        if (filterCategory !== 'All') {
            filtered = filtered.filter(idea => idea.category === filterCategory);
        }
        filtered.sort((a, b) => {
            let comparison = (sortBy === 'votes') ? a.votes - b.votes : a.submittedAt.getTime() - b.submittedAt.getTime();
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return filtered;
    }, [recentIdeas, filterCategory, sortBy, sortOrder]);


    const handleFormSubmit = async (formData) => {
        // ... (handleFormSubmit logic) ...
         try {
            // const response = await api.post('/ideas', formData);
            // Mock response
            const response = { data: { _id: Date.now(), ...formData } }; 
            const newIdea = {
                id: response.data._id,
                title: response.data.title,
                category: response.data.category,
                description: response.data.description,
                time: 'Just now',
                submittedAt: new Date(),
                votes: 0,
                link: '#'
            };
            setRecentIdeas(prev => [newIdea, ...(prev || [])].slice(0, 5));
            navigate('/artisan/dashboard'); 
        } catch (err) {
            console.error("Failed to submit idea:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to submit. Please try again.";
            throw new Error(errorMessage);
        }
    };

    const openIdeaModal = (idea) => { setSelectedIdea(idea); };
    const handleAddToProducts = (ideaData) => {
        navigate('/artisan/products/new', { state: { ideaData: {
            name: ideaData.title,
            description: ideaData.description,
            category: ideaData.category
        } } });
    };

    // --- Loading State ---
    if (loading && !recentIdeas) {
        return (
            // Removed min-h-screen
            <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
                <div className="flex-grow space-y-8"><SkeletonBase className="h-10 w-3/4 mb-4"/><SkeletonForm/></div>
                <div className="lg:w-80 flex-shrink-0 space-y-6"><SkeletonSidebarCard /></div>
            </div>
        );
    }
     
    // --- Error State ---
    if (error && !recentIdeas) {
         return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
                 <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-medium text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600 text-sm mb-6">{error}</p>
            </div>
        );
    }

    // --- Main Return ---
    return (
        <>
            {/* FIX: Removed min-h-screen from here. 
              The layout component (ArtisanLayout) handles the min-height.
              Added padding (py-8 md:py-10) to create space from the header.
            */}
            <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">

                {/* --- Main Content Area (Form) --- */}
                <div className="flex-grow lg:w-2/3">
                    {/*
                      FIX: Removed mb-8 from this AnimatedSection.
                      The page padding (py-8) already provides space from the header.
                      The mb-8 was moved to the *header* section inside this one.
                    */}
                    <AnimatedSection>
                         <div className="text-center mb-8 pt-8"> {/* Added margin-bottom here */}
                            <h1
                                className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
                                style={{
                                    background: 'linear-gradient(90deg, #70d969ff, #0F9D58)', 
                                    color: '#fbfcfeff' // Changed color for contrast
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

                {/* --- Right Sidebar (Recent Activity) --- */}
                <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
                    <AnimatedSection>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            {/* ... (Sidebar Header with Filters) ... */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <HistoryIcon className="h-6 w-6 text-gray-500" />
                                    <h3 className="text-base font-medium text-gray-800 whitespace-nowrap">Recent Ideas</h3>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue" aria-label="Filter by category">
                                       {categoriesForFilter.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-gray-50 focus:ring-1 focus:ring-google-blue focus:border-google-blue" aria-label="Sort by">
                                        <option value="date">Date</option>
                                        <option value="votes">Votes</option>
                                    </select>
                                    <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-1 rounded hover:bg-gray-100 text-gray-500" aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}>
                                        {sortOrder === 'asc' ? <SortAscendingIcon className="w-4 h-4"/> : <SortDescendingIcon className="w-4 h-4"/>}
                                    </button>
                                </div>
                            </div>

                            {/* ... (Error Display) ... */}
                            {error && <p className="p-4 text-xs text-red-600 bg-red-50">{error}</p>}

                            {/* ... (Idea List) ... */}
                            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                {loading && !recentIdeas ? ( <div className="p-4 text-center text-xs text-gray-500">Loading ideas...</div> )
                                 : displayedIdeas.length > 0 ? (
                                    displayedIdeas.map(idea => (
                                        <button
                                            key={idea.id}
                                            onClick={() => openIdeaModal(idea)}
                                            className="block w-full text-left p-4 hover:bg-gray-50/70 transition-colors focus:outline-none focus:bg-gray-100"
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm text-gray-800 leading-snug flex-1 pr-2">{idea.title}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                                                    <ThumbUpIcon className="w-3 h-3 text-gray-400" />
                                                    <span>{idea.votes}</span>
                                                </div>
            
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{idea.category}</span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{idea.time}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    !error && <p className="text-center text-gray-500 py-6 text-xs px-4">No ideas match your filters.</p>
                                )}
                            </div>

                            {/* ... (Footer Link) ... */}
                            {recentIdeas && recentIdeas.length > 0 && (
                                <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                                    <Link to="/artisan/ideas" className="text-google-blue text-xs font-medium hover:underline">View all submitted ideas</Link>
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                </aside>
            </div>

            {/* --- Render Modal Conditionally --- */}
            {selectedIdea && (
                <IdeaDetailModal
                    idea={selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                    onAddToProducts={handleAddToProducts}
                />
            )}
        </> // End Fragment
    );
};

export default IdeaSubmissionPage;