import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

const StarRatingInput = ({
  rating,
  setRating,
  hoverRating,
  setHoverRating,
}) => (
  <div className="flex space-x-1" onMouseLeave={() => setHoverRating(0)}>
    {[1, 2, 3, 4, 5].map((star) => {
      const currentRating = hoverRating || rating;
      const Icon = star <= currentRating ? StarIconSolid : StarIconOutline;
      return (
        <Icon
          key={star}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            star <= currentRating
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
        />
      );
    })}
  </div>
);

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
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 50, scale: 0.9 },
};

const ReviewModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (rating === 0) {
      toast.error("Please select a rating (1-5 stars).");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      });

      toast.success("Thank you for your review!");
      setLoading(false);

      if (onReviewSubmitted && response.data.product) {
        const newReview =
          response.data.product.reviews[
            response.data.product.reviews.length - 1
          ];
        if (newReview) {
          onReviewSubmitted(newReview);
        }
      }

      setRating(0);
      setComment("");
      setHoverRating(0);
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);
      const errorMessage =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to submit review. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(4px)" }} 
        >
          <motion.div
            className="absolute inset-0 bg-black/30"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose} 
          />

          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Write a Review for {productName || "this product"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Star Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating*
                  </label>
                  <StarRatingInput
                    rating={rating}
                    setRating={setRating}
                    hoverRating={hoverRating}
                    setHoverRating={setHoverRating}
                  />
                </div>

                {/* Comment Input */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-google-blue"
                  />
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="flex justify-end space-x-3 p-5 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-google-blue rounded-lg shadow-sm hover:bg-google-red transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue disabled:opacity-50 disabled:bg-gray-400"
                >
                  {loading ? "Submitting..." : "Submit Review"}
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
