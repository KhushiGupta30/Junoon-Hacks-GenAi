import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Import shared components and icons
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path
import {
    UsersIcon, // Ensure correct component name
    CalendarIcon,
    ChatAlt2Icon,
    XIcon,
    LocationMarkerIcon,
    ExclamationCircleIcon // For error state
} from '../../components/common/Icons'; // Adjust path

// --- Skeleton Component Placeholders ---
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
    <div className="py-3 px-4 animate-pulse"> {/* Added padding */}
        <SkeletonBase className="h-4 w-4/5 mb-1.5"/>
        <SkeletonBase className="h-3 w-1/2"/>
    </div>
);
// --- End Skeletons ---

// --- Tab Component (Google Style - Copied from LogiPage) ---
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


// --- MODAL COMPONENT for Ambassador Details (Keep as is) ---
const AmbassadorDetailModal = ({ ambassador, onClose }) => {
    // ... (Modal code remains largely the same) ...
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

// --- MAIN COMMUNITY PAGE COMPONENT (Styled like LogiPage) ---
const CommunityPage = () => {
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAmbassadorDetailOpen, setIsAmbassadorDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // Default tab: 'events', 'artisans'

  // --- Mock Data ---
  const mockCommunityData = { /* ... same mock data ... */
      location: "New Delhi, Delhi",
      areaAmbassador: { name: "Anjali Singh", avatar: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", title: "KalaGhar Ambassador - South Delhi", bio: "Seasoned textile artist passionate about helping local artisans access new markets and funding.", specialties: ["Textile Arts", "Business Scaling", "Grant Apps"] },
      localArtisans: [ { id: 1, name: 'Rohan Verma', avatar: 'https://placehold.co/100x100/34A853/FFFFFF?text=RV', craft: 'Pottery', distance: '2.5 km away' }, { id: 2, name: 'Meera Patel', avatar: 'https://placehold.co/100x100/4285F4/FFFFFF?text=MP', craft: 'Madhubani Painting', distance: '4.1 km away' },{ id: 3, name: 'Sanjay Kumar', avatar: 'https://placehold.co/100x100/FBBC05/FFFFFF?text=SK', craft: 'Woodcarving', distance: '5.8 km away' }, ],
      upcomingEvents: [ { id: 1, title: 'Hauz Khas Village Art Market', date: 'Sat, 27 Sep 2025', location: 'Hauz Khas Village', description: 'Monthly market to showcase and sell creations.' }, { id: 2, title: 'Digital Marketing Workshop', date: 'Wed, 01 Oct 2025', location: 'Online via Zoom', description: 'Learn social media skills to boost sales.' }, ],
      discussionTopics: [ { id: 1, title: 'Best place for high-quality clay in Delhi?', author: 'Rohan V.', replies: 5, lastReplyTime: '2h ago', link: '#' }, { id: 2, title: 'Tips for pricing jewelry for international buyers', author: 'Priya S.', replies: 12, lastReplyTime: '1d ago', link: '#' },{ id: 3, title: 'Showcase: My latest wood carving project', author: 'Sanjay K.', replies: 8, lastReplyTime: '3d ago', link: '#' }, ]
   };
  // ---

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCommunityData(mockCommunityData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- Loading State ---
  if (loading) {
     // Copied LogiPage skeleton structure
    return (
       <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
         {/* Main Content Skeleton */}
         <div className="flex-grow space-y-8 md:space-y-10">
            <SkeletonBase className="h-10 w-3/4 mb-4"/> {/* Title Skeleton */}
            <SkeletonBase className="h-10 w-full mb-6"/> {/* Tabs Skeleton */}
            {/* Event Cards Skeleton (Default Tab) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonEventCard />
                <SkeletonEventCard />
            </div>
         </div>
         {/* Sidebar Skeleton */}
         <div className="lg:w-80 flex-shrink-0 space-y-6">
            <SkeletonSidebarCard />
            <SkeletonSidebarCard />
         </div>
       </div>
    );
  }

    // --- Error State ---
    if (!communityData) {
       // Copied LogiPage styling
       return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
                 <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-medium text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600 text-sm mb-6">Could not load community data.</p>
            </div>
        );
    }


  // --- Main Return (Styled like LogiPage) ---
  return (
    <>
      {/* Copied LogiPage outer div styling */}
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">

        {/* --- Main Content Area (Left/Top) --- */}
        <div className="flex-grow lg:w-2/3">
            <AnimatedSection className="mb-8 pt-8 text-center">
                <h1
                    className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
                    style={{
                        background: 'linear-gradient(90deg, #70d969ff, #0F9D58)',
                        color: '#202124'
                    }}
                >
                    Community Hub
                </h1>
                <p className="mt-3 text-gray-700 text-sm flex items-center justify-center gap-1.5">
                    <LocationMarkerIcon className="w-4 h-4 text-gray-500" />
                    Connect locally in <span className="font-medium text-gray-800">{communityData.location}</span>
                </p>
            </AnimatedSection>

            <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-4">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    <TabButton title="Local Events" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                    <TabButton title="Nearby Artisans" isActive={activeTab === 'artisans'} onClick={() => setActiveTab('artisans')} />
                </div>
            </div>

            {/* --- Tab Content --- */}
            <AnimatedSection>
                {/* --- LOCAL EVENTS --- */}
                {activeTab === 'events' && (
                    <div className="space-y-5">
                         {/* Optional Sub-header (if desired, like LogiPage) */}
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <CalendarIcon className="h-6 w-6 text-google-red opacity-80" />
                            <h2 className="text-lg font-medium text-gray-700">Upcoming Events</h2>
                        </div>
                        {communityData.upcomingEvents.length > 0 ? communityData.upcomingEvents.map((event) => (
                             // Card style similar to LogiPage partner cards
                            <div key={event.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                                        <p className="text-xs font-medium text-google-red mt-1">{event.date} &bull; {event.location}</p>
                                        <p className="text-xs text-gray-600 mt-1.5">{event.description}</p>
                                    </div>
                                    {/* Button style more consistent */}
                                    <button className="bg-google-red text-white font-medium px-4 py-1 rounded-md text-xs hover:bg-opacity-90 transition-colors whitespace-nowrap self-start sm:self-center mt-2 sm:mt-0">
                                        Register
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-10 text-sm">No upcoming events scheduled.</p>
                        )}
                    </div>
                )}

                {/* --- NEARBY ARTISANS --- */}
                {activeTab === 'artisans' && (
                    <div className="space-y-4">
                        {/* Optional Sub-header */}
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <UsersIcon className="h-6 w-6 text-google-green opacity-80" />
                            <h2 className="text-lg font-medium text-gray-700">Artisans Near You</h2>
                        </div>
                        {communityData.localArtisans.length > 0 ? communityData.localArtisans.map((artisan) => (
                             // List item card style
                            <div key={artisan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={artisan.avatar} alt={artisan.name} className="h-10 w-10 rounded-full flex-shrink-0" />
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold text-sm text-gray-800 truncate">{artisan.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{artisan.craft}</p>
                                        <p className="text-xs text-google-blue font-medium mt-0.5">{artisan.distance}</p>
                                    </div>
                                </div>
                                {/* Outlined button style */}
                                <button className="border border-google-blue text-google-blue font-medium px-3 py-1 rounded-md text-xs hover:bg-google-blue/10 transition-colors whitespace-nowrap">
                                    View Profile
                                </button>
                            </div>
                        )) : (
                             <p className="text-center text-gray-500 py-10 text-sm">No other artisans found nearby yet.</p>
                        )}
                    </div>
                )}
            </AnimatedSection>
        </div>

        {/* --- Right Sidebar - Styled like LogiPage --- */}
        <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4"> {/* Added mt-4 */}

            {/* --- Ambassador Card - Styled like Sidebar Card --- */}
            <AnimatedSection>
                <div className="bg-blue-50/60 p-6 rounded-xl border border-blue-200/80"> {/* Colored background */}
                    <div className="flex items-center gap-3 mb-3">
                        <UsersIcon className="h-6 w-6 text-google-blue" /> {/* Changed Icon */}
                        <h3 className="text-base font-medium text-gray-800">Your Ambassador</h3>
                    </div>
                     <div className="flex flex-col items-center text-center">
                         <img src={communityData.areaAmbassador.avatar} alt={communityData.areaAmbassador.name} className="h-16 w-16 rounded-full border-4 border-white shadow-md mb-2 mx-auto" />
                        <h4 className="text-sm font-semibold text-gray-800">{communityData.areaAmbassador.name}</h4>
                        <p className="text-xs text-gray-500 font-medium mb-3">{communityData.areaAmbassador.title}</p>
                        <button
                            onClick={() => setIsAmbassadorDetailOpen(true)}
                            className="w-full bg-white text-google-blue border border-blue-200 font-medium py-1.5 rounded-lg hover:bg-blue-100/70 transition-colors text-xs mt-1" // Subtle button
                        >
                           View Details & Contact
                        </button>
                    </div>
                </div>
            </AnimatedSection>

            {/* --- DISCUSSIONS (Moved to Sidebar) - Styled like Sidebar Card --- */}
            <AnimatedSection>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200"> {/* Neutral background */}
                     <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <ChatAlt2Icon className="h-6 w-6 text-gray-500" />
                        <h3 className="text-base font-medium text-gray-800">Active Discussions</h3>
                     </div>
                     <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                         {communityData.discussionTopics.length > 0 ? communityData.discussionTopics.map(topic => (
                            <Link to={topic.link} key={topic.id} className="block p-4 hover:bg-gray-50/70 transition-colors">
                                <p className="font-medium text-sm text-gray-800 hover:text-google-blue leading-snug">{topic.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{topic.replies} replies &bull; Last reply {topic.lastReplyTime}</p>
                            </Link>
                        )) : (
                             <p className="text-center text-gray-500 py-6 text-xs px-4">No active discussions to show.</p>
                        )}
                    </div>
                     {communityData.discussionTopics.length > 0 && (
                         <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                             <Link to="#" className="text-google-blue text-xs font-medium hover:underline">View All Discussions</Link>
                         </div>
                     )}
                </div>
            </AnimatedSection>

        </aside>

      </div>

      {/* Ambassador Modal */}
      {isAmbassadorDetailOpen && (
        <AmbassadorDetailModal
          ambassador={communityData.areaAmbassador}
          onClose={() => setIsAmbassadorDetailOpen(false)}
        />
      )}
    </>
  );
};

export default CommunityPage;