import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  UsersIcon,
  CalendarIcon,
  ChatAlt2Icon,
  XIcon,
  LocationMarkerIcon,
  ExclamationCircleIcon,
  TicketIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
} from "../../components/common/Icons";
import ArtisanProfileModal from "../../components/modal/ArtisanProfileModal";
import { useAuth } from '../../context/AuthContext';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';


const SkeletonBase = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);
const SkeletonSidebarCard = () => <SkeletonBase className="h-44 md:h-48" />;
const SkeletonEventCard = () => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 animate-pulse space-y-3">
    <SkeletonBase className="h-5 w-3/4" />
    <SkeletonBase className="h-4 w-1/2" />
    <SkeletonBase className="h-4 w-full" />
  </div>
);
const SkeletonDiscussionItem = () => (
  <div className="py-3 px-4 animate-pulse">
    <SkeletonBase className="h-4 w-4/5 mb-1.5" />
    <SkeletonBase className="h-3 w-1/2" />
  </div>
);

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${isActive
      ? "text-google-blue font-medium"
      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 rounded-t-md"
      }`}
    aria-current={isActive ? "page" : undefined}
  >
    {title}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>
    )}
  </button>
);

const AmbassadorDetailModal = ({ ambassador, onClose }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center items-center p-4 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
        } bg-black/50`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 md:p-8 text-center transform transition-all duration-300 ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <img
          src={ambassador.avatar}
          alt={ambassador.name}
          className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white shadow-lg mb-3 mx-auto"
        />
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          {ambassador.name}
        </h3>
        <p className="text-xs text-gray-500 font-medium mb-4">
          {ambassador.title}
        </p>
        <p className="text-gray-600 text-sm mb-6">{ambassador.bio}</p>
        <div className="mt-5 border-t pt-4">
          <h4 className="font-medium text-gray-700 text-center mb-3 text-sm">
            Specialties
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {ambassador.specialties.map((specialty, index) => (
              <span
                key={index}
                className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        <button className="mt-6 w-full max-w-[200px] bg-google-blue text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
          Contact Ambassador
        </button>
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
  const [activeTab, setActiveTab] = useState("events");
  const [selectedArtisanId, setSelectedArtisanId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [localEvents, setLocalEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { user } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const mapContainerStyle = {
    height: "100%",
    width: "100%",
  };
  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    // Define the async function directly inside the effect
    const fetchData = async () => {
      // Set loading states at the beginning
      setLoading(true);
      setEventsLoading(true);
      setError(null);

      try {
        // Use Promise.all to fetch everything concurrently
        const [
          communityRes,
          mentorshipRes,
          discussionsRes,
          nearbyEventsRes
        ] = await Promise.all([
          api.get('/community'),
          api.get('/mentorship/requests'),
          api.get('/discussions'),
          api.get('/events/nearby')
        ]);

        setCommunityData(communityRes.data);
        setMentorshipRequests(mentorshipRes.data.requests || []);
        setDiscussions(discussionsRes.data.slice(0, 5) || []);
        setLocalEvents(nearbyEventsRes.data || []);

      } catch (err) {
        setError('Could not load community data. Please try again later.');
        console.error("Error fetching data:", err);
      } finally {
        // Reset loading states at the end
        setLoading(false);
        setEventsLoading(false);
      }
    };

    // Call the function
    fetchData();
  }, []);

  const combinedEvents = useMemo(() => {
    const manualEvents = (communityData?.upcomingEvents || []).map((event) => ({
      ...event,
      id: event.id,
      isManual: true,
    }));

    const apiEvents = (localEvents || []).map((event) => ({
      ...event,
      id: event.link,
      isManual: false,
    }));

    return [...manualEvents, ...apiEvents];
  }, [communityData, localEvents]);

  const handleRefreshEvents = useCallback(async () => {
    setIsRefreshing(true);
    setEventsLoading(true);
    try {
      const response = await api.post('/events/nearby/refresh');
      setLocalEvents(response.data || []);
    } catch (err) {
      console.error("Error refreshing events:", err);
      setError('Could not refresh events.');
    } finally {
      setIsRefreshing(false);
      setEventsLoading(false);
    }
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/mentorship/${requestId}/accept`);
      setMentorshipRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting mentorship request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        <div className="flex-grow space-y-8 md:space-y-10">
          <SkeletonBase className="h-10 w-3/4 mb-4 mx-auto" />
          <SkeletonBase className="h-6 w-1/2 mb-6 mx-auto" />
          <SkeletonBase className="h-12 w-full mb-8" />
          <div className="space-y-5">
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
        <h2 className="text-xl font-medium text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {error || "Could not load community data."}
        </p>
      </div>
    );
  }
  const userLocation = (user?.profile?.location?.latitude && user?.profile?.location?.longitude)
    ? { lat: user.profile.location.latitude, lng: user.profile.location.longitude }
    : { lat: 28.6139, lng: 77.2090 };

  // Replace the entire return (...) block in your component with this:

  // Replace the entire return (...) block in your component with this:

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        <div className="flex-grow lg:w-2/3">
          <AnimatedSection className="mb-8 pt-8 text-center">
            <h1
              className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
              style={{ background: 'linear-gradient(90deg, #70d969ff, #0F9D58)', color: '#fafbfdff' }}
            >
              Community Hub
            </h1>
            <p className="mt-3 text-gray-700 text-sm flex items-center justify-center gap-1-5">
              <LocationMarkerIcon className="w-4 h-4 text-gray-500" />
              Connect locally in <span className="font-medium text-gray-800">{communityData.location}</span>
            </p>
          </AnimatedSection>

          <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              <TabButton title="Upcoming Events" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
              <TabButton title="Nearby Artisans" isActive={activeTab === 'artisans'} onClick={() => setActiveTab('artisans')} />
              <TabButton title="Mentorship Requests" isActive={activeTab === 'mentorship'} onClick={() => setActiveTab('mentorship')} />
            </div>
          </div>

          <AnimatedSection>
            {activeTab === 'events' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center gap-3 mb-4 px-1">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6 text-google-red opacity-80" />
                    <h2 className="text-lg font-medium text-gray-700">Upcoming Events & Exhibitions</h2>
                  </div>
                  <button
                    onClick={handleRefreshEvents}
                    disabled={isRefreshing || eventsLoading}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCwIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                {eventsLoading ? (
                  <>
                    <SkeletonEventCard />
                    <SkeletonEventCard />
                  </>
                ) : combinedEvents.length > 0 ? (
                  combinedEvents.map((event) => (
                    event.isManual ? (
                      <div key={event.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-xs font-medium text-google-red mt-1">{event.date} &bull; {event.location}</p>
                            <p className="text-xs text-gray-600 mt-1.5">{event.description}</p>
                          </div>
                          <button className="bg-google-red text-white font-medium px-4 py-1 rounded-md text-xs hover:bg-opacity-90 transition-colors whitespace-nowrap self-start sm:self-center mt-2 sm:mt-0">
                            Register
                          </button>
                        </div>
                      </div>
                    ) : (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={event.id}
                        className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800 hover:text-google-blue">{event.title}</h3>
                            <p className="text-xs font-medium text-google-green mt-1">{event.date}</p>
                            <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{event.snippet}</p>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-center mt-2 sm:mt-0">
                            <p className="text-xs text-gray-500">{event.source}</p>
                            <ExternalLinkIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      </a>
                    )
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-10 text-sm">No upcoming events found in your area.</p>
                )}
              </div>
            )}
            {activeTab === 'artisans' && (
              <div>
                <div className="flex items-center gap-3 mb-4 px-1">
                  <UsersIcon className="h-6 w-6 text-google-green opacity-80" />
                  <h2 className="text-lg font-medium text-gray-700">Artisans Near You</h2>
                </div>
                {communityData.localArtisans.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {communityData.localArtisans.map((artisan) => (
                        <button
                          key={artisan.id}
                          onClick={() => {
                            if (typeof artisan.latitude === 'number' && typeof artisan.longitude === 'number') {
                              setSelectedMarker(artisan);
                              if (mapRef.current) {
                                mapRef.current.panTo({ lat: artisan.latitude, lng: artisan.longitude });
                              }
                            } else {
                              console.warn(`Artisan "${artisan.name}" is missing valid coordinates.`);
                            }
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedMarker?.id === artisan.id ? 'bg-white shadow-md border-google-blue' : 'bg-white/70 border-gray-200 hover:bg-white hover:shadow-sm'}`}
                        >
                          <p className="font-semibold text-sm text-gray-800">{artisan.name}</p>
                          <p className="text-xs text-gray-500">{artisan.craft}</p>
                          <p className="text-xs font-medium text-google-blue mt-1">{artisan.distance}</p>
                        </button>
                      ))}
                    </div>

                    <div className="lg:col-span-2 h-[400px] md:h-[500px] w-full rounded-lg shadow-md overflow-hidden border border-gray-200">
                      {!isLoaded && <div>Loading Map...</div>}
                      {loadError && <div>Error loading maps</div>}
                      {isLoaded && !loadError && (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={userLocation}
                          zoom={11}
                          onLoad={onMapLoad}
                          options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                          }}
                        >
                          <Marker
                            position={userLocation}
                            icon={{
                              path: window.google.maps.SymbolPath.CIRCLE,
                              scale: 8, fillColor: "#4285F4", fillOpacity: 1,
                              strokeColor: "white", strokeWeight: 3,
                            }}
                          />
                          {communityData.localArtisans.map((artisan) =>
                            (typeof artisan.latitude === 'number' && typeof artisan.longitude === 'number') && (
                              <Marker
                                key={artisan.id}
                                position={{ lat: artisan.latitude, lng: artisan.longitude }}
                                onClick={() => setSelectedMarker(artisan)}
                              />
                            )
                          )}
                          {selectedMarker && (
                            <InfoWindow
                              position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                              onCloseClick={() => setSelectedMarker(null)}
                            >
                              <div className="p-1">
                                <p className="font-semibold text-sm">{selectedMarker.name}</p>
                                <button onClick={() => setSelectedArtisanId(selectedMarker.id)} className="text-xs text-google-blue font-medium hover:underline mt-1">
                                  View Profile
                                </button>
                              </div>
                            </InfoWindow>
                          )}
                        </GoogleMap>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10 text-sm">No other artisans found nearby yet.</p>
                )}
              </div>
            )}
            {activeTab === 'mentorship' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4 px-1">
                  <UsersIcon className="h-6 w-6 text-google-blue opacity-80" />
                  <h2 className="text-lg font-medium text-gray-700">Mentorship Requests</h2>
                </div>
                {mentorshipRequests.length > 0 ? (
                  mentorshipRequests.map((request) => (
                    <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <img src={request.ambassador?.profile?.avatar || 'https://placehold.co/100x100/4285F4/FFFFFF?text=A'} alt={request.ambassador?.name || 'Ambassador'} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{request.ambassador?.name || 'Ambassador'}</p>
                          <p className="text-xs text-gray-500">Wants to be your mentor</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-google-green text-white font-medium px-4 py-1.5 rounded-md text-xs hover:bg-opacity-90 transition-colors whitespace-nowrap"
                      >
                        Accept
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-10 text-sm">You have no new mentorship requests.</p>
                )}
              </div>
            )}
          </AnimatedSection>
        </div>

        <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
          <AnimatedSection>
            <div className="bg-blue-50/60 p-6 rounded-xl border border-blue-200/80">
              <div className="flex items-center gap-3 mb-3">
                <UsersIcon className="h-6 w-6 text-google-blue" />
                <h3 className="text-base font-medium text-gray-800">Your Ambassador</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src={communityData.areaAmbassador.avatar} alt={communityData.areaAmbassador.name} className="h-16 w-16 rounded-full border-4 border-white shadow-md mb-2 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-800">{communityData.areaAmbassador.name}</h4>
                <p className="text-xs text-gray-500 font-medium mb-3">{communityData.areaAmbassador.title}</p>
                <button
                  onClick={() => setIsAmbassadorDetailOpen(true)}
                  className="w-full bg-white text-google-blue border border-blue-200 font-medium py-1.5 rounded-lg hover:bg-blue-100/70 transition-colors text-xs mt-1"
                >
                  View Details & Contact
                </button>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <ChatAlt2Icon className="h-6 w-6 text-gray-500" />
                <h3 className="text-base font-medium text-gray-800">Active Discussions</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {discussions.length > 0 ? discussions.map(topic => (
                  <Link to={`/artisan/discussions/${topic._id}`} key={topic._id} className="block p-4 hover:bg-gray-50/70 transition-colors">
                    <p className="font-medium text-sm text-gray-800 hover:text-google-blue leading-snug">{topic.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started by {topic.author.name}
                    </p>
                  </Link>
                )) : (
                  <p className="text-center text-gray-500 py-6 text-xs px-4">No active discussions to show.</p>
                )}
              </div>
              {discussions.length > 0 && (
                <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                  <Link to="/artisan/discussions" className="text-google-blue text-xs font-medium hover:underline">View All Discussions</Link>
                </div>
              )}
            </div>
          </AnimatedSection>
        </aside>
      </div>
      {isAmbassadorDetailOpen && (
        <AmbassadorDetailModal
          ambassador={communityData.areaAmbassador}
          onClose={() => setIsAmbassadorDetailOpen(false)}
        />
      )}
      {selectedArtisanId && (
        <ArtisanProfileModal
          artisanId={selectedArtisanId}
          onClose={() => setSelectedArtisanId(null)}
        />
      )}
    </>
  );
};

export default CommunityPage;
