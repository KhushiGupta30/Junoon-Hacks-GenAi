import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Search } from 'lucide-react';

const ArtisanCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);

const BrowseArtisans = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
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

    const filteredArtisans = artisans.filter(artisan =>
        artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.artisanProfile?.craftSpecialty?.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Artisans</h1>
                <p className="text-gray-600 mb-4">Browse profiles of talented artisans and find opportunities to invest in their craft.</p>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or craft..."
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

            {!loading && error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArtisans.map(artisan => (
                        <div key={artisan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <img src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${artisan.name}&background=random`} alt={artisan.name} className="w-16 h-16 rounded-full mr-4"/>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-800">{artisan.name}</h3>
                                    <p className="text-sm text-gray-500">{artisan.artisanProfile?.craftSpecialty?.join(', ') || 'Craftsman'}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link to={`/seller/${artisan.id}`} className="flex-1 text-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-600 transition w-full block">
                                    View Profile & Invest
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseArtisans;