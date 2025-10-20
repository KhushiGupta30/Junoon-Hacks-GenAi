import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import api from '../../api/axiosConfig'; // Adjust path if needed
// Import Shared Components & Icons
import AnimatedSection from '../../components/ui/AnimatedSection'; // Adjust path if needed
import {
    
    SparklesIcon,
    LightBulbIcon,
    PencilIcon,
    ExclamationCircleIcon,
    CheckCircleIcon, // For checklist
    RadioButtonIcon, // For checklist (as pending)
    InformationCircleIcon, // For tips
    ArrowLeftIcon // Make sure this is in Icons.jsx
    
} from '../../components/common/Icons'; // Adjust path if needed

// --- Skeleton Component Placeholders ---
const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonSidebarCard = () => <SkeletonBase className="h-44 md:h-48" />;
const SkeletonForm = () => <SkeletonBase className="h-[40rem]" />; // Tall form skeleton
// --- End Skeletons ---

// --- REUSABLE FORM COMPONENTS (Keep) ---
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label> {/* Added mb-1.5 */}
    <input
      id={id}
      {...props}
      // Refined styling for Google look
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm
                 disabled:bg-gray-50 disabled:text-gray-500"
    />
  </div>
);

const FormSelect = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label> {/* Added mb-1.5 */}
    <select
      id={id}
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm 
                 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm"
    >
      {children}
    </select>
  </div>
);

// --- INTERNAL FORM FIELDS COMPONENT (Tweaked for checklist) ---
const ProductFormFields = ({ initialData, onSubmit, onFormDataChange }) => { // Added onFormDataChange prop
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Other",
    status: "draft",
    inventory: { quantity: 1, isUnlimited: false },
    images: [{ url: "", alt: "" }],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState(null);
  const [error, setError] = useState("");

  const location = useLocation(); // Get location to check for passed state

  useEffect(() => {
    // Check if we are being navigated to from the "Add to Products" modal
    const ideaData = location.state?.ideaData;
    if (ideaData) {
        setFormData(prev => ({
            ...prev,
            name: ideaData.name || '',
            description: ideaData.description || '',
            category: ideaData.category || 'Other',
        }));
    } 
    // If editing, load that data instead
    else if (initialData) { 
        setFormData({
            name: initialData.name || "",
            description: initialData.description || "",
            price: initialData.price || "",
            category: initialData.category || "Other",
            status: initialData.status || "draft",
            inventory: {
                quantity: initialData.inventory?.quantity ?? 1,
                isUnlimited: initialData.inventory?.isUnlimited || false,
            },
            images: initialData.images?.length ? initialData.images : [{ url: "", alt: "" }],
        });
    }
    // Call onFormDataChange on mount with initial/pre-filled data
    onFormDataChange(ideaData ? { ...formData, ...ideaData } : initialData || formData);
  }, [initialData, location.state]); // Depend on initialData and location.state

  const categories = ["Pottery", "Textiles", "Painting", "Woodwork", "Metalwork", "Sculpture", "Jewelry", "Other"];
  const statuses = ["draft", "active", "inactive"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = { ...formData };

    if (name.startsWith("inventory.")) {
      const key = name.split(".")[1];
      newFormData.inventory = {
          ...newFormData.inventory,
          [key]: type === "checkbox" ? checked : value,
      };
    } else if (name === "images.0.url") {
      newFormData.images = [{ ...newFormData.images[0], url: value }];
    } else {
      newFormData = { ...newFormData, [name]: value };
    }
    
    setFormData(newFormData);
    onFormDataChange(newFormData); // Pass changes up to parent for checklist
  };

  const handleGenerateDescription = async () => {
    // ... (logic remains the same) ...
  };

  const handleSuggestPrice = async () => {
    // ... (logic remains the same) ...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    // Form styling from LogiPage
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
      {error && (
        <div className="text-red-700 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* --- Core Details Section --- */}
      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Core Details</h2>
          <p className="mt-1 text-xs text-gray-500">This is the essential information for your product listing.</p>
        </div>
        <FormInput label="Product Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="e.g., Hand-Painted Ceramic Mug" />
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-google-blue px-2 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SparklesIcon className="w-3.5 h-3.5"/> {/* Adjusted size */}
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Tell a story about your product, its inspiration, and the creation process." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <button
                type="button"
                onClick={handleSuggestPrice}
                disabled={isSuggestingPrice}
                className="flex items-center gap-1 text-xs font-semibold text-white bg-google-green px-2 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LightBulbIcon className="w-3.5 h-3.5"/> {/* Adjusted size */}
                {isSuggestingPrice ? "Analyzing..." : "Suggest Price"}
              </button>
            </div>
            <FormInput id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="e.g., 50.00" />
            {priceSuggestion && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <p className="font-bold text-yellow-800">AI Suggestion: ${priceSuggestion.suggestedPriceRange}</p>
                <p className="text-xs text-yellow-700 mt-1">{priceSuggestion.justification}</p>
              </div>
            )}
          </div>
          <FormSelect label="Category" id="category" name="category" value={formData.category} onChange={handleChange}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</FormSelect>
        </div>
      </div>

      {/* --- Inventory & Status Section --- */}
      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-200"><h2 className="text-lg font-medium text-gray-800">Inventory & Status</h2><p className="mt-1 text-xs text-gray-500">Manage stock and marketplace visibility.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <FormInput label="Available Quantity" id="inventory.quantity" name="inventory.quantity" type="number" value={formData.inventory.quantity} onChange={handleChange} min="0" disabled={formData.inventory.isUnlimited} />
            <div className="flex items-center mt-3"><input type="checkbox" id="inventory.isUnlimited" name="inventory.isUnlimited" checked={formData.inventory.isUnlimited} onChange={handleChange} className="h-4 w-4 text-google-blue border-gray-300 rounded focus:ring-google-blue" /><label htmlFor="inventory.isUnlimited" className="ml-2 block text-sm text-gray-700">Made to order (Unlimited)</label></div> {/* Adjusted text */}
          </div>
          <FormSelect label="Product Status" id="status" name="status" value={formData.status} onChange={handleChange}>{statuses.map(stat => <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>)}</FormSelect>
        </div>
      </div>

      {/* --- Product Images Section --- */}
      <div className="space-y-6">
         <div className="pb-4 border-b border-gray-200"><h2 className="text-lg font-medium text-gray-800">Product Images</h2><p className="mt-1 text-xs text-gray-500">A great picture is key. Provide a URL for now.</p></div>
        <div className="mt-1"><FormInput label="Primary Image URL" id="images.0.url" name="images.0.url" type="text" value={formData.images[0].url} onChange={handleChange} placeholder="https://example.com/image.png" required /></div>
      </div>

      {/* --- Form Actions --- */}
      <div className="flex justify-end items-center gap-3 pt-5 border-t border-gray-200">
        <button type="button" onClick={() => navigate("/artisan/products")} className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors text-sm">Cancel</button>
        <button type="submit" disabled={formLoading} className="bg-google-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2">
            {formLoading && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {formLoading ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
        </button>
      </div>
    </form>
  );
};

// --- NEW: Sidebar Checklist Item ---
const ChecklistItem = ({ text, isComplete }) => (
    <div className={`flex items-start gap-2 transition-colors ${isComplete ? 'text-gray-700' : 'text-gray-400'}`}>
        <div className="flex-shrink-0 mt-0.5">
            {isComplete ? <CheckCircleIcon className="w-4 h-4 text-google-green" /> : <RadioButtonIcon className="w-4 h-4 text-gray-300" />}
        </div>
        <span className={`text-xs ${isComplete ? 'font-medium' : 'font-normal'}`}>{text}</span>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const ProductEditPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const isEditMode = !!productId;

    // State to hold current form data for the checklist
    const [checklistData, setChecklistData] = useState({});

    useEffect(() => {
        // ... (fetchProduct logic remains the same) ...
        if (isEditMode) {
            setPageLoading(true);
            const fetchProduct = async () => {
                try {
                    const response = await api.get(`/products/${productId}`);
                    setInitialData(response.data);
                    setChecklistData(response.data); // Set checklist data on load
                    setPageError('');
                } catch (err) {
                    setPageError('Failed to fetch product data. Please check the ID or try again.');
                    console.error(err);
                    setInitialData(null);
                } finally {
                    setPageLoading(false);
                }
            };
            fetchProduct();
        } else {
            setPageLoading(false);
            setInitialData(null); 
            setChecklistData({}); // Start with empty checklist data for 'new'
        }
    }, [productId, isEditMode]);

    const handleFormSubmit = async (formData) => {
        // ... (data cleaning payload logic remains the same) ...
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            inventory: {
                ...formData.inventory,
                quantity: formData.inventory.isUnlimited ? 0 : parseInt(formData.inventory.quantity, 10) || 0,
            },
            images: formData.images.filter(img => img.url && img.url.trim() !== '').map(img => ({ url: img.url, alt: img.alt || formData.name || 'Product Image' })),
        };
         if (isNaN(payload.price) || payload.price < 0) throw new Error("Invalid price.");
         if (!formData.inventory.isUnlimited && (isNaN(payload.inventory.quantity) || payload.inventory.quantity < 0)) throw new Error("Invalid quantity.");
         if (payload.images.length === 0) throw new Error("At least one image URL required.");

        try {
            if (isEditMode) {
                await api.put(`/products/${productId}`, payload);
            } else {
                await api.post('/products', payload);
            }
            navigate('/artisan/products'); // Redirect after success
        } catch (error) {
            console.error("Failed to submit form:", error);
            throw new Error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Failed to save product.");
        }
    };

    // --- Checklist Logic ---
    const checklist = useMemo(() => {
        const data = checklistData || {};
        const inventory = data.inventory || {};
        return [
            { text: "Add a clear product name", isComplete: (data.name?.length || 0) >= 5 },
            { text: "Write a detailed description (min. 50 chars)", isComplete: (data.description?.length || 0) >= 50 },
            { text: "Set a valid price", isComplete: (parseFloat(data.price) || 0) > 0 },
            { text: "Add at least one high-quality image", isComplete: (data.images?.[0]?.url || '').length > 10 },
            { text: "Set inventory (quantity or 'Made to Order')", isComplete: (inventory.quantity > 0 || inventory.isUnlimited === true) },
            { text: "Select 'Active' status to publish", isComplete: data.status === 'active' },
        ];
    }, [checklistData]);

    const isChecklistComplete = checklist.every(item => item.isComplete);
    // ---

    if (pageLoading && isEditMode) {
        return (
            <div className="p-6">
                <SkeletonSidebarCard />
                <div className="mt-4"><SkeletonForm /></div>
            </div>
        );
    }
    if (pageError && isEditMode) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-center">
                <ExclamationCircleIcon className="mx-auto h-8 w-8 text-red-500" />
                <h2 className="mt-3 text-lg font-medium text-gray-800">Unable to load product</h2>
                <p className="mt-2 text-sm text-gray-600">{pageError}</p>
                <div className="mt-4">
                    <button onClick={() => navigate('/artisan/products')} className="inline-flex items-center px-4 py-2 bg-google-blue text-white rounded-md text-sm">Back to Products</button>
                </div>
            </div>
        );
    }

    // --- Main Return (2-Column Layout) ---
    return (
        // Styled outer div like LogiPage
        <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">

            {/* --- Main Content Area (Form) --- */}
            <div className="flex-grow lg:w-2/3">
                <AnimatedSection className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                    <p className="mt-1 text-gray-500">
                        {isEditMode ? `Editing "${initialData?.name || 'product'}"` : 'Fill out the details to list a new creation.'}
                    </p>
                </AnimatedSection>
                
                <AnimatedSection>
                    <ProductFormFields
                        initialData={initialData}
                        onSubmit={handleFormSubmit}
                        onFormDataChange={setChecklistData} // Pass the state updater
                    />
                </AnimatedSection>
            </div>

            {/* --- Right Sidebar (Checklist & Tips) --- */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
                {/* Publish Checklist Card */}
                <AnimatedSection>
                     <div className={`rounded-xl shadow-sm border ${isChecklistComplete ? 'bg-green-50/60 border-green-200/80' : 'bg-white border-gray-200'}`}>
                         <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            {isChecklistComplete 
                                ? <CheckCircleIcon className="h-6 w-6 text-google-green" /> 
                                : <RadioButtonIcon className="h-6 w-6 text-gray-400" /> 
                            }
                            <h3 className="text-base font-medium text-gray-800">Publish Checklist</h3>
                         </div>
                         <div className="p-4 space-y-2.5">
                             {checklist.map(item => (
                                 <ChecklistItem key={item.text} text={item.text} isComplete={item.isComplete} />
                             ))}
                         </div>
                         {isChecklistComplete && (
                             <div className="p-4 border-t border-green-200/80 text-center">
                                 <p className="text-sm font-medium text-google-green">Ready to publish!</p>
                             </div>
                         )}
                    </div>
                </AnimatedSection>

                {/* Tips Card */}
                <AnimatedSection>
                     <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200/80">
                        <div className="flex items-center gap-2.5 mb-2">
                             <InformationCircleIcon className="h-5 w-5 text-google-blue" />
                             <h3 className="text-sm font-medium text-blue-900">Tips for Success</h3>
                         </div>
                        <ul className="list-disc list-outside pl-5 space-y-1.5">
                            <li className="text-xs text-gray-700 leading-relaxed">Use bright, clear photos against a neutral background.</li>
                            <li className="text-xs text-gray-700 leading-relaxed">Tell the story behind your product in the description.</li>
                            <li className="text-xs text-gray-700 leading-relaxed">Check the AI Price Suggestion to stay competitive.</li>
                        </ul>
                    </div>
                </AnimatedSection>

            </aside>
        </div>
    );
};

export default ProductEditPage;