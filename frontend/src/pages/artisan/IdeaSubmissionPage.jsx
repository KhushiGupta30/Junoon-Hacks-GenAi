import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

const LightBulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const TagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>);


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

const RecentIdeaSkeleton = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);

const IdeaSubmissionPage = () => {
  const navigate = useNavigate();
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentIdeas = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/ideas?limit=5&sortBy=createdAt');
            setRecentIdeas(response.data.ideas.map(idea => ({...idea, submittedAt: new Date(idea.createdAt)})));
        } catch (err) {
            console.error("Failed to fetch recent ideas:", err);
            setError("Could not load recent ideas.");
        } finally {
            setLoading(false);
        }
    };
    fetchRecentIdeas();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
        await api.post('/ideas', formData);
        alert('Your idea has been submitted successfully!');
        navigate('/artisan/dashboard');
    } catch (err) {
        console.error("Failed to submit idea:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to submit your idea. Please try again.";
        throw new Error(errorMessage);
    }
  };
  
  return (
    <div className="container mx-auto px-6 py-16">
        <AnimatedSection className="mb-12">
           <div className="flex flex-col md:flex-row justify-center items-center text-center gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-google-yellow hidden sm:block"><LightBulbIcon /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800">Submit a New Idea</h1>
                <p className="mt-1 text-gray-600">Share your next masterpiece to get feedback and pre-orders from the community.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
                <AnimatedSection>
                    <IdeaSubmissionFormFields onSubmit={handleFormSubmit} />
                </AnimatedSection>
            </div>
            <div className="lg:col-span-2">
                <AnimatedSection>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Recently Submitted Ideas</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <>
                                    <RecentIdeaSkeleton />
                                    <RecentIdeaSkeleton />
                                    <RecentIdeaSkeleton />
                                </>
                            ) : error ? (
                                <p className="text-red-500 text-sm text-center py-4">{error}</p>
                            ) : recentIdeas.length > 0 ? (
                                recentIdeas.map(idea => (
                                    <div key={idea.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200/80">
                                        <h4 className="font-bold text-sm text-gray-800 truncate">{idea.title}</h4>
                                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
                                            <span className="flex items-center gap-1.5"><TagIcon /> {idea.category}</span>
                                            <span className="flex items-center gap-1.5"><ClockIcon /> {idea.submittedAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-8">Be the first to submit an idea!</p>
                            )}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    </div>
  );
};

export default IdeaSubmissionPage;