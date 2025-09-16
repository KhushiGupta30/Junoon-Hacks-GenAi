import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const IdeaSubmissionPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        // In a real app, you would have an image upload feature.
        // For now, we'll omit sending image data.
    });
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
            await api.post('/ideas', formData);
            // On success, redirect the user back to their dashboard
            navigate('/artisan/dashboard');
        } catch (err) {
            console.error("Failed to submit idea:", err);
            const errorMessage = err.response?.data?.message || "Failed to submit your idea. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const FormInput = ({ label, id, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <input id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm" />
        </div>
    );

    const FormSelect = ({ label, id, children, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <select id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm">
                {children}
            </select>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-google-blue">Submit a New Idea</h1>
                    <button onClick={() => navigate('/artisan/dashboard')} className="text-sm font-semibold text-gray-600 hover:text-gray-800">
                        &larr; Cancel
                    </button>
                </div>
            </header>
            <main className="container mx-auto p-6">
                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-xl shadow-lg space-y-8 max-w-3xl mx-auto border border-gray-200">
                    {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg font-medium border border-red-200">{error}</p>}
                    
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-800">Share Your Next Masterpiece</h2>
                        <p className="mt-1 text-sm text-gray-500">Get feedback and pre-orders from the community before you start creating.</p>
                    </div>

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
                            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Detailed Description</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                                rows="6" 
                                placeholder="Describe your idea. What makes it unique? What materials would you use? What's the story behind it?" 
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"
                            ></textarea>
                        </div>

                        <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </FormSelect>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-gray-200">
                        <button type="submit" disabled={loading} className="bg-google-green text-white font-bold px-8 py-2 rounded-md hover:bg-green-700 transition-colors shadow-sm disabled:bg-green-300 disabled:cursor-not-allowed">
                            {loading ? 'Submitting...' : 'Submit Idea for Review'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default IdeaSubmissionPage;