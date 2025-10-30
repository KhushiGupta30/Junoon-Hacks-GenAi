import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import InvestmentModal from "../../components/modal/InvestmentModal";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
    >
      <Link
        to={`../product/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-offset-2 rounded-t-lg"
      >
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-800 mb-2 h-10 line-clamp-2">
          <Link
            to={`/product/${product.id}`}
            className="hover:text-google-blue transition-colors focus:outline-none focus:ring-1 focus:ring-google-blue rounded"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-base font-semibold text-gray-700">
            ₹{(Number(product.price) || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
        setError(
          "Could not find this artisan. They may no longer be on the platform."
        );
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
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 text-center container mx-auto px-6">
        {}
        <div className="flex justify-center items-center mt-4">
          <svg
            className="animate-spin h-8 w-8 text-google-blue"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg ml-3">
            Loading Artisan Profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="pt-24 pb-12 text-center container mx-auto px-6">
        {}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-red-600">Artisan Not Found</h2>
          <p className="text-gray-600 mt-2">
            {error || "The requested artisan could not be found."}
          </p>
          <Link
            to="/market"
            className="mt-6 inline-block bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-google-red transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {}
      {}
      <div
        className="relative z-0 h-80 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: "url('/2.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.3 },
                },
              }}
              className="flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              {}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: -1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5"
              >
                <motion.img
                  layoutId={`artisan-avatar-${artisanId}`}
                  src={
                    artisan.profile?.avatar ||
                    `https:
                      /\s/g,
                      "+"
                    )}&background=E8F0FE&color=4285F4&bold=true`
                  }
                  alt={artisan.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl bg-white"
                />
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {artisan.name}
                  </h1>
                  <p className="text-base text-gray-200 mt-1">
                    {artisan.artisanProfile?.craftSpecialty?.join(", ") ||
                      "Creator of Fine Crafts"}
                  </p>
                  <p className="text-sm text-gray-200 mt-1">
                    {artisan.city && artisan.state
                      ? `${artisan.city}, ${artisan.state}`
                      : "Location not specified"}
                  </p>
                </div>
              </motion.div>

              {}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: -90 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                className="max-w-lg text-gray-100 text-sm leading-relaxed hidden md:block"
              >
                {artisan.artisanProfile?.story ? (
                  <p className="italic">"{artisan.artisanProfile.story}"</p>
                ) : (
                  <p className="text-gray-300 italic">
                    This artisan’s story will be unveiled soon...
                  </p>
                )}
              </motion.div>

              {}
              {user?.role === "investor" && user.id !== artisanId && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-google-green text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm shadow-sm hover:shadow relative left-[-100px]"
                >
                  Invest
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {}
      {}
      <motion.div
        className="relative z-10 -mt-16 pb-16 bg-gray-50 rounded-t-3xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6 pt-12">
          {}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Products by {artisan.name}
            </h2>
          </motion.div>

          {products && products.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              variants={containerVariants}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-500 py-8"
            >
              This artisan has not listed any products yet.
            </motion.p>
          )}
        </div>
      </motion.div>
      {}

      {}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artisanId={artisanId}
        artisanName={artisan?.name}
        onSuccess={handleInvestmentSuccess}
      />
    </>
  );
};

export default SellerPage;
