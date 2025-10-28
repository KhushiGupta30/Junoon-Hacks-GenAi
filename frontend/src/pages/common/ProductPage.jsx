import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- 1. Import motion
import api from '../../api/axiosConfig.js';
import { useCart } from '../../context/CartContext.jsx';

// --- Icons remain the same ---
const HeartIcon = () => ( <svg className="w-6 h-6 text-gray-600 group-hover:text-google-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg> );
const PlayIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>;

// --- 2. Define Animation Variants ---
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger the left and right columns
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
  hidden: { opacity: 1 }, // Keep container visible
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the content inside the right column
      delayChildren: 0.2, // Start after the column itself animates in
    },
  },
};

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay initially

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Could not find this product. It might have been moved or deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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


  // --- Loading State ---
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

  // --- Error State ---
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
    <div className="pt-24 pb-20 overflow-hidden"> {/* Added overflow-hidden for safety */}
      <div className="container mx-auto px-6">
        {/* --- 3. Apply Variants to Main Grid --- */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* --- Left Column: Media + Reviews --- */}
          <motion.div className="flex flex-col" variants={columnItemVariants}>
            {/* --- Media Carousel (Smaller) --- */}
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
              {/* Carousel Controls */}
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

            {/* --- NEW Reviews Section --- */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-gray-500 text-center">No reviews yet for this product.</p>
              </div>
            </div>
          </motion.div>
          
          {/* --- Product Details (Right Column) --- */}
          {/* 4. Apply container variants to the column, and item variants to its children */}
          <motion.div 
            className="flex flex-col" 
            variants={detailsContainerVariants} // Staggers its children
          >
            <motion.p 
              className="font-semibold text-google-blue tracking-wide"
              variants={columnItemVariants} // Use the same item variant
            >
              {product.category.toUpperCase()}
            </motion.p>
            
            <motion.div 
              className="flex justify-between items-start gap-6 mt-3"
              variants={columnItemVariants}
            >
              {/* Left Side: Info */}
              <div className="flex-grow">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
                <p className="text-lg text-gray-500 mt-2">
                  by <Link to={`../seller/${product.artisan.id}`} className="font-medium text-gray-700 hover:text-google-blue hover:underline">{product.artisan.name}</Link>
                </p>
                <p className="text-4xl font-bold text-google-green mt-4">${product.price.toFixed(2)}</p>
              </div>

              {/* Right Side: Buttons (Smaller) */}
              <div className="flex flex-col space-y-3 pt-2 flex-shrink-0 w-48">
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
  );
};

export default ProductPage;