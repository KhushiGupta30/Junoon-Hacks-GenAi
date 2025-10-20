import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Search, UserPlus } from 'lucide-react';

const ArtisanCard = ({ artisan }) => {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get(`/mentorship/status/${artisan.id}`).then(res => setStatus(res.data.status));
    }, [artisan.id]);

    const handleRequest = async () => {
        setStatus('loading');
        try {
            await api.post(`/mentorship/request/${artisan.id}`);
            setStatus('pending');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send request.");
            api.get(`/mentorship/status/${artisan.id}`).then(res => setStatus(res.data.status));
        }
    };

    const renderButton = () => {
        switch (status) {
            case 'available':
                return <button onClick={handleRequest} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"><UserPlus size={16} className="mr-2" />Mentor</button>;
            case 'pending':
                return <p className="text-sm text-center text-yellow-600 font-semibold">Request Pending</p>;
            case 'mentored_by_other':
                return <p className="text-sm text-center text-gray-500">Already Mentored</p>;
            case 'active':
                 return <p className="text-sm text-center text-green-600 font-semibold">You are mentoring</p>;
            default:
                return <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse"></div>;
        }
    };

    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                 <img src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${artisan.name}`} alt={artisan.name} className="w-16 h-16 rounded-full"/>
                 <div className="flex-1">
                     <h3 className="font-bold text-gray-800">{artisan.name}</h3>
                     <p className="text-sm text-gray-500">{artisan.artisanProfile?.craftSpecialty?.join(', ') || 'General Craft'}</p>
                 </div>
            </div>
            <div className="mt-4">
                {renderButton()}
            </div>
        </div>
    );
};

const FindArtisans = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/artisans/unmentored')
            .then(res => setArtisans(res.data.artisans))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Artisans to Mentor</h1>
            <p className="text-gray-600 mb-6">Connect with artisans who are looking for guidance and support.</p>
            {loading ? (
                <p>Loading artisans...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artisans.map(artisan => <ArtisanCard key={artisan.id} artisan={artisan} />)}
                </div>
            )}
        </div>
    );
};

export default FindArtisans;