import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BuyerHeader } from "../pages/buyermarket";
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext.jsx';

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
  const [isPlaying, setIsPlaying] = useState(true);

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

  const allMedia = product ? (product.images?.map(img => img.url) || []) : [];

  const navigateMedia = (direction) => {
    setCurrentMediaIndex(prevIndex => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return allMedia.length - 1;
      if (newIndex >= allMedia.length) return 0;
      return newIndex;
    });
  };

  useEffect(() => {
    if (isPlaying && allMedia.length > 1) {
      const timer = setInterval(() => {
        navigateMedia(1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentMediaIndex, isPlaying, allMedia.length]);

  if (loading) { return ( <div className="font-sans bg-gray-50 min-h-screen"> <BuyerHeader /> <div className="pt-32 text-center container mx-auto"> <p className="text-gray-600 text-lg">Loading Product...</p> </div> </div> ); }
  if (error || !product) { return ( <div className="font-sans bg-gray-50 min-h-screen"> <BuyerHeader /> <div className="pt-32 text-center container mx-auto"> <h2 className="text-3xl font-bold text-gray-800">Product Not Found!</h2> <p className="text-red-500 mt-2">{error}</p> <Link to="/" className="mt-6 inline-block bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors"> Back to Marketplace </Link> </div> </div> ); }

  const currentMedia = allMedia[currentMediaIndex];
  const isVideo = currentMedia && currentMedia.includes("youtube.com/embed");

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <BuyerHeader />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="relative" onMouseEnter={() => setIsPlaying(false)} onMouseLeave={() => setIsPlaying(true)} >
              <div className="w-full rounded-2xl shadow-xl object-cover aspect-square flex items-center justify-center bg-gray-200 overflow-hidden">
                {isVideo ? ( <iframe src={currentMedia} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full" title="Product Video"></iframe> ) : ( <img src={currentMedia || '/placeholder.png'} alt={`${product.name} - View ${currentMediaIndex + 1}`} className="w-full h-full object-cover"/> )}
              </div>
              {allMedia.length > 1 && (
                <>
                  <button onClick={() => navigateMedia(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-colors z-10" aria-label="Previous image"> <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> </button>
                  <button onClick={() => navigateMedia(1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-colors z-10" aria-label="Next image"> <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg> </button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors z-10" aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"} > {isPlaying ? <PauseIcon /> : <PlayIcon />} </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {allMedia.map((_, index) => (
                      <button key={index} onClick={() => setCurrentMediaIndex(index)} className={`w-3 h-3 rounded-full ${index === currentMediaIndex ? 'bg-google-blue' : 'bg-gray-400'} hover:bg-google-blue transition-colors`} aria-label={`View media ${index + 1}`}></button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col space-y-5">
              <p className="font-semibold text-google-blue tracking-wide">{product.category.toUpperCase()}</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-500"> by <Link to={`/seller/${product.artisan._id}`} className="font-medium text-gray-700 hover:text-google-blue hover:underline">{product.artisan.name}</Link> </p>
              <p className="text-4xl font-bold text-google-green">${product.price.toFixed(2)}</p>
              <div className="border-t pt-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800">About this item</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <button onClick={() => addToCart(product)} className="flex-grow bg-google-blue text-white font-bold py-4 px-6 rounded-xl hover:bg-google-red transition-colors duration-300 text-lg shadow-md hover:shadow-lg">Add to Cart</button>
                  <button className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-google-red transition-colors group"><HeartIcon /></button>
                </div>
                <button className="w-full bg-google-green text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-colors duration-300 text-lg shadow-md hover:shadow-lg">Invest in this business</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;