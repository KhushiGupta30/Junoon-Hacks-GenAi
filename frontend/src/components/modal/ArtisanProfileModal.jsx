// File: frontend/src/components/modal/ArtisanProfileModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig'; //

// Make sure these components are exported from ArtisanProfilePage.jsx
import {
  ArtisanProfileCard,
  ArtisanStats,
  RecentProducts,
  Reviews,
} from '../../pages/artisan/ArtisanProfilePage'; //

// Simple X icon
const XIcon = () => ( //
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ArtisanProfileModal = ({ artisanId, onClose }) => {
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data when artisanId changes
  useEffect(() => {
    if (!artisanId) return;

    const fetchProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch data concurrently
        const [artisanRes, productsRes, reviewsRes] = await Promise.all([
          api.get(`/users/${artisanId}`), //
          api.get(`/products/artisan/${artisanId}?limit=3`), //
          api.get(`/reviews/artisan/${artisanId}?limit=3`), //
        ]);
        setArtisan(artisanRes.data);
        setProducts(productsRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to fetch artisan data:', err);
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [artisanId]);

  // Close modal if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Modal Overlay
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 overflow-y-auto animate-fade-in"
    >
      {/* Modal Content Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"
        >
          <XIcon />
        </button>

        {/* Modal Body */}
        <div className="p-6 md:p-10">
          {loading && <div>Loading profile...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && artisan && (
            // Reuse components from the original profile page
            <div className="space-y-8">
              <ArtisanProfileCard artisan={artisan} /> {/* */}
              <ArtisanStats
                productsCount={products.length}
                reviewCount={reviews.length}
                rating={artisan.profile?.averageRating} // Use optional chaining
              /> {/* */}
              <RecentProducts products={products} /> {/* */}
              <Reviews reviews={reviews} /> {/* */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfileModal;