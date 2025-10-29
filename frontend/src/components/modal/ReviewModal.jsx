import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig'; // Assuming you'll use this to submit
import { toast } from 'react-hot-toast';

// --- Star Icon ---
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    className={`w-8 h-8 cursor-pointer transition-colors ${
      filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
    }`}
    fill="currentColor"
    viewBox="0 0 24 24"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  </svg>
);

// --- Animation Variants ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 50, scale: 0.9 },
};

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (rating === 0) {
      toast.error('Please select a rating (1-5 stars).');
      setLoading(false);
      return;
    }

    try {
      // --- Replace with your actual API call ---
      // const response = await api.post(`/products/${productId}/reviews`, {
      //   rating,
      //   comment,
      // });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your review!');
      setLoading(false);
      
      // Optionally, pass the new review back to the page to update the list
      // if (onReviewSubmitted) {
      //   onReviewSubmitted(response.data.review); 
      // }

      // Reset form and close
      setRating(0);
      setComment('');
      onClose();

    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error('Failed to submit review. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                
                {/* Star Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div 
                    className="flex space-x-1"
                    onMouseLeave={() => setHoverRating(0)} // Reset hover on container leave
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentRating = hoverRating || rating;
                      return (
                        <StarIcon
                          key={star}
                          filled={star <= currentRating}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                        />
                      );
                    })}
                  </div>
                </div>
                
                {/* Comment Input */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
                  />
                </div>
              </div>
              
              {/* Footer / Actions */}
              <div className="flex justify-end space-x-3 p-5 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-google-blue rounded-lg hover:bg-google-red transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue disabled:opacity-50 disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;