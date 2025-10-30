import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Users,
  Heart,
  Globe,
  Palette,
  Sparkles,
  Award,
  Store,
  X,
  Lightbulb,
} from "lucide-react";
import Footer from "../../components/layout/Footer";
import api from "../../api/axiosConfig";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const featuredArtisans = [
  {
    id: "a1",
    name: "Rina Devi",
    craft: "Master Weaver",
    location: "Varanasi, Uttar Pradesh",
    story:
      "For Rina Devi, weaving is more than a craft; it's a conversation with her ancestors. 'Each thread,' she says, 'carries a story from my grandmother.'",
    fullStory:
      "Born into a family of weavers, Rina Devi learned to weave before she could write. Her grandmother would tell her stories of the Ganges, and Rina would try to capture the river's ripples in her silk threads. For years, she struggled to find a market for her intricate silk sarees, nearly abandoning the art to support her family. 'I was weaving in the dark,' she recalls. 'My hands knew the patterns, but my heart was heavy.' Today, her work is celebrated for its blend of traditional motifs and modern minimalism, allowing her to not only support her family but also to teach a new generation of young women in her village, ensuring the loom's song never fades.",
    imageUrl:
      "https://placehold.co/800x600/3B82F6/FFFFFF?text=Rina+Devi&font=inter",
  },
  {
    id: "a2",
    name: "Suresh Kumar",
    craft: "Potter & Sculptor",
    location: "Jaipur, Rajasthan",
    story:
      "Suresh molds the earth of his homeland. 'When I work with clay,' he explains, 'I feel I am shaping the world and keeping my traditions alive.'",
    fullStory:
      "Suresh Kumar's earliest memory is the cool, damp smell of river clay in his father's workshop. 'He would give me small lumps to play with, and I would make animals and tiny pots,' Suresh remembers. As he grew, his play transformed into a passion. He is a master of both the wheel and hand-sculpting, creating pieces that are both functional and deeply spiritual. He only uses local clays and natural glazes, believing that each piece should carry the essence of Rajasthan. 'When I work with clay,' he explains, 'I feel I am shaping the world and keeping my traditions alive for my children.'",
    imageUrl:
      "https://placehold.co/800x600/8B4513/FFFFFF?text=Suresh+K.&font=inter",
  },
];

const HeroBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center p-8 md:py-12 md:px-8 text-center mb-12 md:mb-16 rounded-2xl overflow-hidden"
      style={{ backgroundImage: `url(/2.png)` }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
      <div className="relative z-10">
        <Lightbulb className="w-10 h-10 text-google-yellow mx-auto mb-3" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Discover Our <span className="text-google-yellow">Artisans</span>
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          Explore authentic items with rich stories, direct from the artisans
          who craft them.
        </p>
      </div>
    </section>
  );
};
const placeholderColors = [
  { bg: 'E8F0FE', text: '4285F4' }, // Blue background, dark blue text
  { bg: 'E6F4EA', text: '34A853' }, // Green background, dark green text
  { bg: 'FCE8E6', text: 'EA4335' }, // Red background, dark red text
  { bg: 'FEF7E0', text: 'FBBC05' }, // Yellow background, dark yellow text
  { bg: 'F3E8FD', text: '8E24AA' }, // Purple background, dark purple text
  { bg: 'E0F7FA', text: '00796B' }, // Cyan background, dark cyan text
];
const ArtisanCard = ({ artisan }) => {
  const colors = {
    Textiles: "text-google-blue",
    Pottery: "text-google-green",
    Painting: "text-google-red",
    Woodwork: "text-yellow-700",
    Metalwork: "text-google-yellow",
    Jewelry: "text-gray-500",
    default: "text-google-blue",
  };
  const craftColor = colors[artisan.artisanProfile?.craftSpecialty?.[0]] || colors.default;
  const firstName = artisan.name?.split(' ')[0] || 'Artisan';
  let hash = 0;
  if (artisan.name) {
    for (let i = 0; i < artisan.name.length; i++) {
      hash += artisan.name.charCodeAt(i);
    }
  }
  const colorIndex = hash % placeholderColors.length;
  const selectedColor = placeholderColors[colorIndex];
  const placeholderUrl = `https://placehold.co/600x600/${selectedColor.bg}/${selectedColor.text}?text=${firstName}&font=roboto`;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg flex flex-col">
      <div className="relative h-40 bg-gray-100">
        <img
          src={artisan.profile?.avatar || placeholderUrl}
          alt={`Portrait of ${artisan.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Error";
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {artisan.name}
        </h3>
        <p className={`text-sm font-medium ${craftColor} mb-2`}>
          {artisan.artisanProfile?.craftSpecialty?.join(', ') || 'Artisan'}
        </p>
        <div className="flex items-center space-x-1.5 text-sm text-gray-500 mb-3">
          <MapPin size={14} />
          <span>{artisan.profile?.location?.city || 'India'}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {artisan.profile?.bio || 'A passionate creator from the heart of India.'}
        </p>
        <Link
          to={`/buyer/seller/${artisan.id}`}
          className="inline-flex items-center space-x-2 text-sm font-medium text-google-blue rounded-lg transition-colors group-hover:underline mt-auto"
        >
          <span>View Profile</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

const FeaturedArtisanCard = ({ artisan, onStoryClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100/50 group">
      <div className="md:w-1/3 w-full h-48 md:h-auto">
        <img
          src={artisan.imageUrl}
          alt={`Featured artisan ${artisan.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x600/E2E8F0/AAAAAA?text=Image+Error";
          }}
        />
      </div>
      <div className="md:w-2/3 w-full p-6 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-800 mt-2 mb-1">
          {artisan.name}
        </h3>
        <div className="flex items-center space-x-2 text-base text-google-blue font-medium mb-3">
          <Award size={18} />
          <span>
            {artisan.craft} from {artisan.location}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm mb-5">
          {artisan.story}
        </p>
        <button
          onClick={() => onStoryClick(artisan)}
          className="inline-flex items-center space-x-2 text-sm font-medium text-google-blue rounded-lg transition-colors group-hover:underline w-fit"
        >
          <span>Read Full Story</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  const colors = {
    blue: "text-google-blue bg-google-blue/10",
    green: "text-google-green bg-google-green/10",
    yellow: "text-google-yellow bg-google-yellow/10",
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`rounded-full p-3 ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const OurImpact = () => {
  const steps = [
    {
      icon: Sparkles,
      title: "Discover Stories",
      description: "Connect with the rich heritage and personal journeys behind every unique piece.",
      color: "blue",
    },
    {
      icon: Store,
      title: "Shop Directly",
      description: "Your purchases directly support artisans, their families, and their communities.",
      color: "green",
    },
    {
      icon: Heart,
      title: "Empower Heritage",
      description: "Help preserve age-old techniques and cultural traditions for future generations.",
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex space-x-4">
          <div className={`flex-shrink-0 rounded-full p-3 bg-google-${step.color}/10 text-google-${step.color}`}>
            <step.icon size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ArtisanLocationMap = ({ artisanList }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);

  const mapContainerStyle = { height: "100%", width: "100%" };
  const center = { lat: 22.5, lng: 78.9 }; // Center of India

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Artisans Across India</h2>
      <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">Discover our creators, from their workshops to your home.</p>
      <div className="h-[450px] w-full rounded-lg overflow-hidden">
        {loadError && <div>Error loading map</div>}
        {!isLoaded && <div className="w-full h-full bg-gray-200 animate-pulse"></div>}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={5}
            options={{ disableDefaultUI: true, zoomControl: true }}
          >
            {artisanList.map((artisan) =>
              (artisan.profile?.location?.latitude && artisan.profile?.location?.longitude) && (
                <Marker
                  key={artisan.id}
                  position={{
                    lat: artisan.profile.location.latitude,
                    lng: artisan.profile.location.longitude,
                  }}
                  onClick={() => setSelectedMarker(artisan)}
                />
              )
            )}
            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.profile.location.latitude,
                  lng: selectedMarker.profile.location.longitude,
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-1">
                  <h4 className="font-bold">{selectedMarker.name}</h4>
                  <p className="text-sm">{selectedMarker.artisanProfile?.craftSpecialty?.join(', ')}</p>
                  <Link to={`/buyer/seller/${selectedMarker.id}`} className="text-xs text-google-blue font-medium hover:underline mt-1">View Profile</Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

const ArtisanStoryModal = ({ artisan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={artisan.imageUrl} alt={artisan.name} className="w-full h-56 object-cover" onError={(e) => { e.target.src = "https://placehold.co/800x400/E2E8F0/AAAAAA?text=Image+Error"; }} />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/70 p-1.5 rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{artisan.name}</h2>
          <div className="flex items-center space-x-2 text-base text-google-blue font-medium mb-6">
            <Award size={18} />
            <span>{artisan.craft} from {artisan.location}</span>
          </div>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
            <p>{artisan.fullStory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OurArtisansPage() {
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users/artisans");
        setArtisans(response.data.artisans || []);
      } catch (err) {
        setError("Could not load artisan data. Please try again later.");
        console.error("Error fetching artisans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  const stats = useMemo(() => {
    if (!artisans.length) return { totalArtisans: 0, totalStates: 0, totalCrafts: 0 };
    const states = new Set(artisans.map(a => a.profile?.location?.state).filter(Boolean));
    const crafts = new Set(artisans.flatMap(a => a.artisanProfile?.craftSpecialty).filter(Boolean));
    return {
      totalArtisans: artisans.length,
      totalStates: states.size,
      totalCrafts: crafts.size,
    };
  }, [artisans]);

  const handleStoryClick = (artisan) => {
    setSelectedArtisan(artisan);
  };

  const handleCloseModal = () => {
    setSelectedArtisan(null);
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-gray-900">
      <main className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <HeroBanner />
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Artisans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {featuredArtisans.map((artisan) => (
              <FeaturedArtisanCard key={artisan.id} artisan={artisan} onStoryClick={handleStoryClick} />
            ))}
          </div>
        </section>
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={Users} title="Total Artisans" value={loading ? '...' : stats.totalArtisans} color="blue" />
            <StatCard icon={Globe} title="States Represented" value={loading ? '...' : stats.totalStates} color="green" />
            <StatCard icon={Palette} title="Crafts Featured" value={loading ? '...' : stats.totalCrafts} color="yellow" />
          </div>
        </section>
        <section className="mb-12 md:mb-16">
          <OurImpact />
        </section>
        <section className="mb-12 md:mb-16">
          <ArtisanLocationMap artisanList={artisans} />
        </section>
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meet Our Artisans</h2>
          {loading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">{[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>)}</div>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}
        </section>
      </main>
      {selectedArtisan && (
        <ArtisanStoryModal artisan={selectedArtisan} onClose={handleCloseModal} />
      )}
      <Footer />
    </div>
  );
}