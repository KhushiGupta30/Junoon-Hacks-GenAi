import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig.js'; 
import { useCart } from '../../context/CartContext.jsx';
import BulkOrderModal from '../../components/modal/BulkOrder.jsx';
import ReviewModal from '../../components/modal/ReviewModal.jsx';
import { toast } from 'react-hot-toast'; 
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'; 
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'; 

const HeartIcon = () => ( <svg className="w-6 h-6 text-gray-600 group-hover:text-google-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg> );
const PlayIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>;

const StarRatingDisplay = ({ rating, size = "h-5 w-5" }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
            const Icon = i < Math.round(rating) ? StarIconSolid : StarIconOutline;
            return <Icon key={i} className={`${size} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />;
        })}
    </div>
);

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

const columnItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const detailsContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const location = useLocation(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]); 

  const isBuyerRoute = location.pathname.startsWith('/buyer');
  const isInvestorRoute = location.pathname.startsWith('/investor');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setReviews(response.data.reviews || []); 
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Could not find this product. It might have been moved or deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewSubmitted = (newReview) => {
    setReviews(prevReviews => [...prevReviews, newReview]);
    toast.success("Thank you for your review!");
  };

  const allMedia = product ? [...(product.images?.map(img => ({ type: 'image', url: img.url })) || []), ...(product.videos?.map(vid => ({ type: 'video', url: vid.url })) || [])] : [];

  const navigateMedia = (direction) => {
    setCurrentMediaIndex(prevIndex => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return allMedia.length - 1;
      if (newIndex >= allMedia.length) return 0;
      return newIndex;
    });
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && allMedia.length > 1) {
      timer = setInterval(() => {
        setCurrentMediaIndex(prevIndex => (prevIndex + 1) % allMedia.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, allMedia.length]);

  if (loading) {
    return (
      <div className="pt-24 pb-12 text-center container mx-auto">
        <p className="text-gray-600 text-lg">Loading Product...</p>
        <div className="flex justify-center items-center mt-4">
          <svg className="animate-spin h-8 w-8 text-google-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-20 text-center container mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">Product Not Found!</h2>
          <p className="text-red-500 mt-2">{error || "The product you are looking for does not exist."}</p>
          <Link to="/buyer/market" className="mt-6 inline-block bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const currentMedia = allMedia[currentMediaIndex];
  const isVideo = currentMedia?.type === 'video';

  return (
    <>
      <div className="pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            
            <motion.div className="flex flex-col" variants={columnItemVariants}>
              <div
                className="relative group"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
              >
                <div className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3] flex items-center justify-center bg-gray-200 overflow-hidden">
                  {currentMedia ? (
                    isVideo ? (
                      <iframe
                        src={currentMedia.url}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                        title="Product Video">
                      </iframe>
                    ) : (
                      <img
                        src={currentMedia.url}
                        alt={`${product.name} - View ${currentMediaIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img src='/placeholder.png' alt="Placeholder" className="w-full h-full object-cover opacity-50"/>
                  )}
                </div>
                
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateMedia(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button
                      onClick={() => navigateMedia(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute top-3 right-3 bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {allMedia.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => { setCurrentMediaIndex(index); setIsPlaying(false); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentMediaIndex ? 'bg-google-blue scale-125' : 'bg-gray-400/70 hover:bg-gray-500/90'}`}
                          aria-label={`View media ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Reviews ({reviews.length})</h2>
                  {isBuyerRoute && (
                     <button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="text-sm font-medium text-google-blue hover:text-blue-700"
                     >
                       Write a Review
                     </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review._id || review.date} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {review.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <StarRatingDisplay rating={review.rating} />
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No reviews yet for this product.</p>
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col" 
              variants={detailsContainerVariants}
            >
              <motion.p 
                className="font-semibold text-google-blue tracking-wide"
                variants={columnItemVariants}
              >
                {product.category.toUpperCase()}
              </motion.p>
              
              <motion.div 
                className="flex justify-between items-start gap-6 mt-3"
                variants={columnItemVariants}
              >
                <div className="flex-grow">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
                  <p className="text-lg text-gray-500 mt-2">
                    by <Link to={`/buyer/seller/${product.artisan._id}`} className="font-medium text-gray-700 hover:text-google-blue hover:underline">{product.artisan.name}</Link>
                  </p>
                  <p className="text-4xl font-bold text-google-green mt-4">₹{(Number(product.price) || 0).toFixed(2)}</p>
                </div>

                <div className="flex flex-col space-y-3 pt-2 flex-shrink-0 w-48">
                  {isBuyerRoute && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-grow bg-google-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-google-red transition-colors duration-300 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue"
                      >
                        Add to Cart
                      </button>
                      <button className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-google-red transition-colors group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-red">
                        <HeartIcon />
                      </button>
                    </div>
                  )}
                  
                  {(isBuyerRoute || isInvestorRoute) && (
                    <button
                      onClick={() => setIsBulkModalOpen(true)}
                      className="w-full text-center bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors duration-300 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Place Bulk Order
                    </button>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="border-t pt-6 mt-6"
                variants={columnItemVariants}
              >
                <h3 className="text-xl font-bold mb-2 text-gray-800">About this item</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>

      <BulkOrderModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        productId={id}
        productName={product?.name}
      />
      
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={id}
        productName={product?.name} 
        onReviewSubmitted={handleReviewSubmitted} 
      /> 
      
    </>
  );
};

export default ProductPage;