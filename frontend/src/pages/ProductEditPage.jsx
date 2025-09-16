import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductForm from '../components/ProductForm';

const ProductEditPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const isEditMode = Boolean(productId);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/products/${productId}`);
                    setProduct(response.data);
                } catch (err) {
                    console.error("Failed to fetch product for editing:", err);
                    setError("Could not load product data. It might not exist or you may not have permission to edit it.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else {
            setLoading(false);
        }
    }, [productId, isEditMode]);

    const handleFormSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await api.put(`/products/${productId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            navigate('/artisan/products');
        } catch (err) {
            console.error("Failed to save product:", err);
            const errorMessage = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`;
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    if (loading) {
        return <div className="text-center p-10 bg-gray-50 min-h-screen">Loading form...</div>;
    }
    
    if (error && isEditMode) {
        return <div className="text-center p-10 bg-gray-50 min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                     <h1 className="text-3xl font-bold text-google-blue">
                        {isEditMode ? `Editing: ${product?.name || 'Product'}` : 'Create a New Product'}
                    </h1>
                    <button onClick={() => navigate('/artisan/products')} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                        &larr; Back to Products
                    </button>
                </div>
            </header>
            <main className="container mx-auto p-6">
                <ProductForm 
                    initialData={product} 
                    onSubmit={handleFormSubmit}
                />
            </main>
        </div>
    );
};

export default ProductEditPage;