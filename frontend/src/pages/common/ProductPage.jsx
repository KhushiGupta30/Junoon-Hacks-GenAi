import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// --- REMOVED BuyerHeader and Footer imports ---
import api from '../../api/axiosConfig.js';
import { useCart } from '../../context/CartContext.jsx';

// --- Icons remain the same ---
const HeartIcon = () => ( <svg className="w-6 h-6 text-gray-600 group-hover:text-google-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg> );
const PlayIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>;

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
      // --- REMOVED BuyerHeader ---
      // Adjusted padding, assuming header is h-16 (adjust if needed)
      <div className="pt-24 pb-12 text-center container mx-auto">
        <p className="text-gray-600 text-lg">Loading Product...</p>
        <div className="flex justify-center items-center mt-4">
          <svg className="animate-spin h-8 w-8 text-google-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      // --- REMOVED Footer ---
    );
  }

  // --- Error State ---
  if (error || !product) {
    return (
      // --- REMOVED BuyerHeader ---
      // Adjusted padding
      <div className="pt-24 pb-20 text-center container mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">Product Not Found!</h2>
          <p className="text-red-500 mt-2">{error || "The product you are looking for does not exist."}</p>
          <Link to="/buyer/market" className="mt-6 inline-block bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors">
            Back to Marketplace
          </Link>
        </div>
      </div>
      // --- REMOVED Footer ---
    );
  }

  const currentMedia = allMedia[currentMediaIndex];
  const isVideo = currentMedia?.type === 'video';

  return (
    // --- REMOVED Outer div and BuyerHeader ---
    // Changed <main> to <div> as layout usually provides <main>
    // Adjusted padding-top (pt-24 assumes h-16 header + some space)
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* --- Media Carousel --- */}
          <div
            className="relative group"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <div className="w-full rounded-2xl shadow-xl object-cover aspect-square flex items-center justify-center bg-gray-200 overflow-hidden">
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
          {/* --- Product Details --- */}
          <div className="flex flex-col space-y-5">
            <p className="font-semibold text-google-blue tracking-wide">{product.category.toUpperCase()}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500">
              by <Link to={`/seller/${product.artisan.id}`} className="font-medium text-gray-700 hover:text-google-blue hover:underline">{product.artisan.name}</Link>
            </p>
            <p className="text-4xl font-bold text-google-green">${product.price.toFixed(2)}</p>
            <div className="border-t pt-5">
              <h3 className="text-xl font-bold mb-2 text-gray-800">About this item</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-grow bg-google-blue text-white font-bold py-4 px-6 rounded-xl hover:bg-google-red transition-colors duration-300 text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue"
                >
                  Add to Cart
                </button>
                <button className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-google-red transition-colors group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-red">
                  <HeartIcon />
                </button>
              </div>
               <Link
                 to={`/seller/${product.artisan.id}`}
                 className="w-full text-center bg-google-green text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-colors duration-300 text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-green"
               >
                 Learn about the Artisan
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    // --- REMOVED Footer ---
  );
};

export default ProductPage;