import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axiosConfig';
import { UserPlus, Search, Info, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArtisanCardSkeleton = () => (
    <div className="p-4 bg-white border rounded-lg shadow-sm animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
        <div className="mt-4 h-9 w-full bg-gray-200 rounded-lg"></div>
    </div>
);

const ArtisanCard = ({ artisan }) => {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let isMounted = true;
        const fetchStatus = async () => {
            try {
                const res = await api.get(`/mentorship/status/${artisan.id}`);
                if (isMounted) setStatus(res.data.status);
            } catch (error) {
                console.error("Failed to fetch mentorship status for artisan:", artisan.id, error);
                if (isMounted) setStatus('available');
            }
        };
        fetchStatus();
        return () => { isMounted = false; };
    }, [artisan.id]);

    const handleRequest = async () => {
        setStatus('sending');
        try {
            await api.post(`/mentorship/request/${artisan.id}`);
            setStatus('pending');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send request.");
            setStatus('available');
        }
    };

    const renderButton = () => {
        switch (status) {
            case 'available':
                return <button onClick={handleRequest} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"><UserPlus size={16} className="mr-2" />Request to Mentor</button>;
            case 'pending':
                return <p className="text-sm text-center font-semibold text-yellow-600">Request Pending</p>;
            case 'mentored_by_other':
                return <p className="text-sm text-center text-gray-500">Already Mentored</p>;
            case 'active':
                 return <p className="text-sm text-center font-semibold text-green-600">You Are Mentoring</p>;
            case 'sending':
                 return <button disabled className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-lg cursor-not-allowed">Sending...</button>;
            default: // loading
                return <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse"></div>;
        }
    };

    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-4">
                 <img src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=random`} alt={artisan.name} className="w-16 h-16 rounded-full object-cover"/>
                 <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-800 truncate">{artisan.name}</h3>
                     <p className="text-sm text-gray-500 capitalize truncate">{artisan.artisanProfile?.craftSpecialty?.join(', ') || 'General Craft'}</p>
                 </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                {renderButton()}
            </div>
        </div>
    );
};

// --- NEW Improved Empty State Component ---
const EmptyState = ({ searchTerm }) => (
    <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">
            {searchTerm ? 'No Artisans Found' : 'The Artisan Community is Growing!'}
        </h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {searchTerm 
                ? `We couldn't find any artisans matching your search for "${searchTerm}". Try a different name or craft.`
                : "It looks like there are no artisans registered on the platform yet. Once they join, they will appear here, ready for mentorship."}
        </p>
    </div>
);


// --- Main Page Component ---
const FindArtisans = () => {
    const { user } = useAuth();
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const res = await api.get('/users/artisans');
                setArtisans(res.data.artisans || []);
            } catch (err) {
                setError("Could not fetch the list of artisans. Please try refreshing the page.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtisans();
    }, []);
    console.log(artisans);

    const filteredArtisans = useMemo(() => {
        if (!searchTerm) return artisans;
        return artisans.filter(artisan => 
            artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artisan.artisanProfile?.craftSpecialty?.some(craft => craft.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [artisans, searchTerm]);

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Artisans</h1>
                <p className="text-gray-600 mb-4">Discover and connect with talented artisans across the platform. Your mentorship can make a real difference.</p>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by name or craft (e.g., Pottery, Weaving)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <ArtisanCardSkeleton key={i} />)}
                </div>
            )}

            {!loading && error && (
                <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
                    <Info size={40} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700">An Error Occurred</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            
            {!loading && !error && filteredArtisans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArtisans.map(artisan => <ArtisanCard key={artisan.id} artisan={artisan} />)}
                </div>
            )}
            
            {/* --- USING THE NEW EMPTY STATE COMPONENT --- */}
            {!loading && !error && filteredArtisans.length === 0 && (
                 <EmptyState searchTerm={searchTerm} />
            )}
        </div>
    );
};

export default FindArtisans;
