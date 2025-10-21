import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import InvestmentModal from '../components/modal/InvestmentModal'; // Corrected path assuming it's in components/modal
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-300">
                <img className="h-56 w-full object-cover" src={product.images[0]?.url || '/placeholder.png'} alt={product.name} />
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-google-blue transition-colors">{product.name}</h3>
                    <p className="mt-4 text-xl font-bold text-google-green">${product.price.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
};

const SellerPage = () => {
    const { user } = useAuth();
    const { artisanId } = useParams();
    const [artisan, setArtisan] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchArtisanData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/users/artisans/${artisanId}`);
                setArtisan(response.data.artisan);
                setProducts(response.data.products);
            } catch (err) {
                console.error("Failed to fetch artisan data:", err);
                setError("Could not find this artisan. They may no longer be on the platform.");
            } finally {
                setLoading(false);
            }
        };

        if (artisanId) {
            fetchArtisanData();
        }
    }, [artisanId]);

    const handleInvestmentSuccess = (message) => {
        toast.success(message);
        // Optionally, you can refetch artisan data here if the profile needs to update
    };

    if (loading) {
        return (
            <div className="py-12 text-center container mx-auto">
                <h2 className="text-3xl font-bold text-gray-800">Loading Artisan Profile...</h2>
            </div>
        );
    }

    if (error || !artisan) {
        return (
            <div className="py-12 text-center container mx-auto">
                <h2 className="text-3xl font-bold text-red-500">Error</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <Link to="/market" className="mt-6 inline-block bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors">
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* The main page container. No header or background color is defined here. */}
            <div className="py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <img
                            src={artisan.profile?.avatar || `https://ui-avatars.com/api/?name=${artisan.name.replace(/\s/g, '+')}&background=F4B400&color=333`}
                            alt={artisan.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-google-yellow"
                        />
                        <h1 className="text-5xl font-extrabold text-gray-900">{artisan.name}</h1>
                        <p className="text-lg text-gray-500 mt-2">
                            {artisan.artisanProfile?.craftSpecialty?.join(', ') || 'Creator of Fine Crafts'}
                        </p>
                        <p className="max-w-2xl mx-auto text-gray-600 mt-4">
                            {artisan.profile?.bio || 'This artisan has not yet provided a biography.'}
                        </p>

                        {/* Shows "Invest" button only for logged-in investors */}
                        {user?.role === 'investor' && user.id !== artisan.id && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-6 bg-google-green text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-colors duration-300 text-lg shadow-md hover:shadow-lg"
                            >
                                Invest in this Business
                            </button>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Products by {artisan.name}</h2>
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">This artisan has not listed any products yet.</p>
                    )}
                </div>
            </div>

            {/* The modal is outside the main flow, so it's fine here */}
            <InvestmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                artisanId={artisan.id}
                artisanName={artisan.name}
                onSuccess={handleInvestmentSuccess}
            />
        </>
    );
};

export default SellerPage;
