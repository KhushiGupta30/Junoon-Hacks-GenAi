import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Plus, Calendar, MapPin, Users, Send } from 'lucide-react';

// Skeleton Loader for Events
const EventCardSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex items-center space-x-4">
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// Modal for Creating a New Event
const CreateEventModal = ({ onClose, onEventCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const eventData = { title, description, date, location };
            const response = await api.post('/events', eventData);
            onEventCreated(response.data); // Pass new event back to parent
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Community Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded"/>
                    <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded h-24"/>
                    <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border rounded"/>
                    <input type="text" placeholder="Location (e.g., City Hall)" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full p-2 border rounded"/>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CommunityHub = () => {  
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId) => {
      // In a real app, you might want to disable the button after click
      try {
          await api.post(`/events/${eventId}/join`);
          alert("Successfully joined the event! The host has been notified.");
          // Optimistically update the UI or refetch events
          fetchEvents();
      } catch (error) {
          alert(error.response?.data?.message || "Could not join the event.");
      }
  };
  
  const handleEventCreated = (newEvent) => {
      setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Community Hub</h1>
            {user.role === 'ambassador' && (
                <button onClick={() => setShowModal(true)} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                    <Plus size={20} className="mr-2" />
                    Create Event
                </button>
            )}
        </div>

        <p className="text-gray-600 mb-8">Upcoming events, workshops, and meetups organized by our ambassadors.</p>

        {loading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
        ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No upcoming events right now. Check back soon!</p>
        ) : (
            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-5 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-xl text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">Hosted by {event.creatorName}</p>
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                            <span className="flex items-center"><Calendar size={14} className="mr-2"/>{new Date(event.date).toLocaleString()}</span>
                            <span className="flex items-center"><MapPin size={14} className="mr-2"/>{event.location}</span>
                            <span className="flex items-center"><Users size={14} className="mr-2"/>{event.attendees?.length || 0} attending</span>
                        </div>
                        {user.role === 'artisan' && !event.attendees?.includes(user.id) && (
                           <div className="mt-4">
                               <button onClick={() => handleJoinEvent(event.id)} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-green-600 transition">
                                    Join Event
                               </button>
                           </div>
                        )}
                         {user.role === 'artisan' && event.attendees?.includes(user.id) && (
                           <div className="mt-4">
                               <p className="text-green-700 font-semibold text-sm">You are attending!</p>
                           </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {showModal && <CreateEventModal onClose={() => setShowModal(false)} onEventCreated={handleEventCreated} />}
    </div>
  );
};

export default CommunityHub;