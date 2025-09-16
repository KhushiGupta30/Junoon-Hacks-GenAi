import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        category: initialData?.category || 'Other',
        status: initialData?.status || 'draft',
        inventory: {
            quantity: initialData?.inventory?.quantity || 1,
            isUnlimited: initialData?.inventory?.isUnlimited || false,
        },
        images: initialData?.images || [{ url: '', alt: '' }],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other'];
    const statuses = ['draft', 'active', 'inactive'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('inventory.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({ ...prev, inventory: { ...prev.inventory, [key]: type === 'checkbox' ? checked : value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reusable styled components for consistency
    const FormInput = ({ label, id, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <input id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm" />
        </div>
    );

    const FormSelect = ({ label, id, children, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <select id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm">
                {children}
            </select>
        </div>
    );
    
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-xl shadow-lg space-y-8 max-w-4xl mx-auto border border-gray-200">
            {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg font-medium border border-red-200">{error}</p>}
            
            <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200">
                     <h2 className="text-xl font-bold text-google-blue">Core Details</h2>
                     <p className="mt-1 text-sm text-gray-500">This is the essential information for your product listing.</p>
                </div>
                
                <FormInput label="Product Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="e.g., Hand-Painted Ceramic Mug" />
                
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Tell a story about your product, its inspiration, and the creation process." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Price (USD)" id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="e.g., 25.00" />
                    <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </FormSelect>
                </div>
            </div>

            <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200">
                     <h2 className="text-xl font-bold text-google-green">Inventory & Status</h2>
                     <p className="mt-1 text-sm text-gray-500">Manage stock levels and visibility on the marketplace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <FormInput label="Available Quantity" id="inventory.quantity" name="inventory.quantity" type="number" value={formData.inventory.quantity} onChange={handleChange} min="0" disabled={formData.inventory.isUnlimited} />
                        <div className="flex items-center mt-3">
                            <input type="checkbox" id="inventory.isUnlimited" name="inventory.isUnlimited" checked={formData.inventory.isUnlimited} onChange={handleChange} className="h-4 w-4 text-google-blue border-gray-300 rounded focus:ring-google-blue" />
                            <label htmlFor="inventory.isUnlimited" className="ml-3 block text-sm text-gray-800">Made to order (Unlimited Quantity)</label>
                        </div>
                    </div>
                    <FormSelect label="Product Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                        {statuses.map(stat => <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>)}
                    </FormSelect>
                </div>
            </div>

             <div className="space-y-6">
                <div className="pb-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-google-yellow">Product Images</h2>
                    <p className="mt-1 text-sm text-gray-500">A great picture is worth a thousand sales. Provide a URL for now.</p>
                </div>
                <div className="mt-1">
                    <FormInput label="Primary Image URL" id="images[0].url" name="images[0].url" type="text" value={formData.images[0].url} onChange={() => {}} placeholder="https://example.com/image.png" />
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/artisan/products')} className="bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="bg-google-blue text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed">
                    {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;