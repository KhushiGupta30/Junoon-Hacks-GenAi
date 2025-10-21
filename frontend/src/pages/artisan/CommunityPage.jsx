import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
    UsersIcon,
    CalendarIcon,
    ChatAlt2Icon,
    XIcon,
    LocationMarkerIcon,
    ExclamationCircleIcon,
} from '../../components/common/Icons';

const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-44 md:h-48" />;
const SkeletonListItem = () => (
    <div className="flex items-center space-x-3 py-3 animate-pulse">
        <SkeletonBase className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/2" />
        </div>
        <SkeletonBase className="h-7 w-20 rounded-md flex-shrink-0" />
    </div>
);
const SkeletonEventCard = () => (
     <div className="bg-white p-5 rounded-lg border border-gray-200 animate-pulse space-y-3">
        <SkeletonBase className="h-5 w-3/4"/>
        <SkeletonBase className="h-4 w-1/2"/>
        <SkeletonBase className="h-4 w-full"/>
     </div>
);
const SkeletonDiscussionItem = () => (
    <div className="py-3 px-4 animate-pulse">
        <SkeletonBase className="h-4 w-4/5 mb-1.5"/>
        <SkeletonBase className="h-3 w-1/2"/>
    </div>
);

const TabButton = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
            isActive ? 'text-google-blue font-medium' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 rounded-t-md'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>}
    </button>
);

const AmbassadorDetailModal = ({ ambassador, onClose }) => {
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    const handleClose = () => { setShow(false); setTimeout(onClose, 300); };

    return (
        <div className={`fixed inset-0 z-[100] flex justify-center items-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'} bg-black/50`} onClick={handleClose}>
            <div className={`relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 md:p-8 text-center transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"><XIcon className="w-5 h-5"/></button>
                <img src={ambassador.avatar} alt={ambassador.name} className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white shadow-lg mb-3 mx-auto" />
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{ambassador.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-4">{ambassador.title}</p>
                <p className="text-gray-600 text-sm mb-6">{ambassador.bio}</p>
                <div className="mt-5 border-t pt-4"><h4 className="font-medium text-gray-700 text-center mb-3 text-sm">Specialties</h4><div className="flex flex-wrap justify-center gap-2">{ambassador.specialties.map((specialty, index) => (<span key={index} className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">{specialty}</span>))}</div></div>
                <button className="mt-6 w-full max-w-[200px] bg-google-blue text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">Contact Ambassador</button>
            </div>
        </div>
    );
};

const CommunityPage = () => {
    const [communityData, setCommunityData] = useState(null);
    const [mentorshipRequests, setMentorshipRequests] = useState([]);
    const [discussions, setDiscussions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAmbassadorDetailOpen, setIsAmbassadorDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('events');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // The API calls now correctly fetch dynamic and separate data
                const [communityRes, mentorshipRes, discussionsRes] = await Promise.all([
                    api.get('/community'), // This now returns dynamic data based on user auth
                    api.get('/mentorship/requests'),
                    api.get('/discussions') 
                ]);

                setCommunityData(communityRes.data);
                // Correctly access the 'requests' array from the response object
                setMentorshipRequests(mentorshipRes.data.requests || []);
                setDiscussions(discussionsRes.data.slice(0, 5));

            } catch (err) {
                setError(err.response?.data?.message || 'Could not load community data. Please try again later.');
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
            // BUG FIX: The mentorship ID is in `request.id`, not `request._id` based on your API response structure
            await api.put(`/mentorship/accept/${requestId}`);
            setMentorshipRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error("Error accepting mentorship request:", error);
            alert("Failed to accept request.");
        }
    };

  if (loading) {
    return (
       <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
         <div className="flex-grow space-y-8 md:space-y-10">
            <SkeletonBase className="h-10 w-3/4 mb-4"/>
            <SkeletonBase className="h-10 w-full mb-6"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonEventCard />
                <SkeletonEventCard />
            </div>
         </div>
         <div className="lg:w-80 flex-shrink-0 space-y-6">
            <SkeletonSidebarCard />
            <SkeletonSidebarCard />
         </div>
       </div>
    );
  }

    if (error || !communityData) {
       return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
                 <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-medium text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600 text-sm mb-6">{error || "Could not load community data."}</p>
            </div>
        );
    }


   return (
        <>
            <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
                <div className="flex-grow lg:w-2/3">
                    <AnimatedSection className="mb-8 pt-8 text-center">
                        {/* ... (No change in header) ... */}
                        <h1 className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md" style={{ background: 'linear-gradient(90deg, #70d969ff, #0F9D58)', color: '#fafbfdff' }}>Community Hub</h1>
                        {/* THIS IS NOW DYNAMIC */}
                        <p className="mt-3 text-gray-700 text-sm flex items-center justify-center gap-1.5">
                            <LocationMarkerIcon className="w-4 h-4 text-gray-500" />
                            Connect locally in <span className="font-medium text-gray-800">{communityData.location}</span>
                        </p>
                    </AnimatedSection>

                    <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-4">
                        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                            <TabButton title="Local Events" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                            <TabButton title="Nearby Artisans" isActive={activeTab === 'artisans'} onClick={() => setActiveTab('artisans')} />
                            <TabButton title="Mentorship Requests" isActive={activeTab === 'mentorship'} onClick={() => setActiveTab('mentorship')} />
                        </div>
                    </div>

                    <AnimatedSection>
                        {/* THIS IS NOW DYNAMIC */}
                        {activeTab === 'events' && ( <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4 px-1"><CalendarIcon className="h-6 w-6 text-google-red opacity-80" /><h2 className="text-lg font-medium text-gray-700">Upcoming Events</h2></div>
                            {communityData.upcomingEvents.length > 0 ? communityData.upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3"><div className="flex-1"><h3 className="text-sm font-semibold text-gray-800">{event.title}</h3><p className="text-xs font-medium text-google-red mt-1">{event.date} &bull; {event.location}</p><p className="text-xs text-gray-600 mt-1.5">{event.description}</p></div><button className="bg-google-red text-white font-medium px-4 py-1 rounded-md text-xs hover:bg-opacity-90 transition-colors whitespace-nowrap self-start sm:self-center mt-2 sm:mt-0">Register</button></div>
                                </div>)) : (<p className="text-center text-gray-500 py-10 text-sm">No upcoming events scheduled in your area.</p>)}
                        </div>)}
                        
                        {/* THIS IS NOW DYNAMIC */}
                        {activeTab === 'artisans' && ( <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4 px-1"><UsersIcon className="h-6 w-6 text-google-green opacity-80" /><h2 className="text-lg font-medium text-gray-700">Artisans Near You</h2></div>
                            {communityData.localArtisans.length > 0 ? communityData.localArtisans.map((artisan) => (
                                <div key={artisan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 overflow-hidden"><img src={artisan.avatar || 'https://placehold.co/100x100/34A853/FFFFFF?text=A'} alt={artisan.name} className="h-10 w-10 rounded-full flex-shrink-0" /><div className="overflow-hidden"><h3 className="font-semibold text-sm text-gray-800 truncate">{artisan.name}</h3><p className="text-xs text-gray-500 truncate">{artisan.craft}</p><p className="text-xs text-google-blue font-medium mt-0.5">{artisan.distance}</p></div></div><button className="border border-google-blue text-google-blue font-medium px-3 py-1 rounded-md text-xs hover:bg-google-blue/10 transition-colors whitespace-nowrap">View Profile</button>
                                </div>)) : (<p className="text-center text-gray-500 py-10 text-sm">No other artisans found nearby yet.</p>)}
                        </div>)}
                        
                        {/* THIS IS DYNAMIC (with bug fix) */}
                        {activeTab === 'mentorship' && ( <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4 px-1"><UsersIcon className="h-6 w-6 text-google-blue opacity-80" /><h2 className="text-lg font-medium text-gray-700">Mentorship Requests</h2></div>
                            {mentorshipRequests.length > 0 ? (mentorshipRequests.map((request) => (
                                <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3"><img src={request.ambassador?.avatar || 'https://placehold.co/100x100/4285F4/FFFFFF?text=A'} alt={request.ambassador?.name} className="h-10 w-10 rounded-full" /><div><p className="font-semibold text-sm text-gray-800">{request.ambassador?.name || 'Unknown Ambassador'}</p><p className="text-xs text-gray-500">Wants to be your mentor</p></div></div>
                                    <button onClick={() => handleAcceptRequest(request.id)} className="bg-google-green text-white font-medium px-4 py-1.5 rounded-md text-xs hover:bg-opacity-90 transition-colors whitespace-nowrap">Accept</button>
                                </div>))
                            ) : (<p className="text-center text-gray-500 py-10 text-sm">You have no new mentorship requests.</p>)}
                        </div>)}
                    </AnimatedSection>
                </div>

                <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
                    {/* THIS IS NOW DYNAMIC */}
                    <AnimatedSection>
                        <div className="bg-blue-50/60 p-6 rounded-xl border border-blue-200/80">
                            <div className="flex items-center gap-3 mb-3"><UsersIcon className="h-6 w-6 text-google-blue" /><h3 className="text-base font-medium text-gray-800">Your Ambassador</h3></div>
                            <div className="flex flex-col items-center text-center"><img src={communityData.areaAmbassador.avatar} alt={communityData.areaAmbassador.name} className="h-16 w-16 rounded-full border-4 border-white shadow-md mb-2 mx-auto" /><h4 className="text-sm font-semibold text-gray-800">{communityData.areaAmbassador.name}</h4><p className="text-xs text-gray-500 font-medium mb-3">{communityData.areaAmbassador.title}</p><button onClick={() => setIsAmbassadorDetailOpen(true)} className="w-full bg-white text-google-blue border border-blue-200 font-medium py-1.5 rounded-lg hover:bg-blue-100/70 transition-colors text-xs mt-1">View Details & Contact</button></div>
                        </div>
                    </AnimatedSection>
                    {/* ... (Discussions section remains the same) ... */}
                </aside>
            </div>
            {isAmbassadorDetailOpen && (<AmbassadorDetailModal ambassador={communityData.areaAmbassador} onClose={() => setIsAmbassadorDetailOpen(false)} />)}
        </>
    );
};

export default CommunityPage;