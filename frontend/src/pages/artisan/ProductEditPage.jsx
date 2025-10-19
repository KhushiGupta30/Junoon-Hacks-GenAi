import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
// import { useAuth } from '../../context/AuthContext'; // Removed - Provided by Layout

// --- REUSABLE ANIMATED SECTION COMPONENT (Keep) ---
// Assuming this is imported correctly, e.g., from '../../components/ui/AnimatedSection'
import AnimatedSection from '../../components/ui/AnimatedSection'; 

// --- ICONS (Keep only ones used by THIS page's content) ---
const PencilAltIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0h1v1h1a1 1 0 110 2h-1v1h-1V3a1 1 0 011-1zM3 9a1 1 0 011-1h1v1a1 1 0 11-2 0V9zm1-4h1v1H4V5zm6 4a1 1 0 011-1h1v1a1 1 0 11-2 0V9zm1-4h1v1h-1V5z"
      clipRule="evenodd"
    />
    <path d="M9 11a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm-4 4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm1-4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm6 4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1zm1-4a1 1 0 011-1h1v1a1 1 0 11-2 0v-1z" />
  </svg>
);
const LightBulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1zM3.93 4.93a1 1 0 001.414 1.414l.707-.707A1 1 0 004.636 4.223L3.93 4.93zM10 4a1 1 0 011-1h.01a1 1 0 110 2H11a1 1 0 01-1-1zM16.07 15.07a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z" />
    <path d="M10 6a4 4 0 100 8 4 4 0 000-8zM8 10a2 2 0 114 0 2 2 0 01-4 0z" />
  </svg>
);

// --- REMOVED ArtisanHeader component ---
// --- REMOVED Footer component ---

// --- REUSABLE FORM COMPONENTS (Keep) ---
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"
    />
  </div>
);

const FormSelect = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"
    >
      {children}
    </select>
  </div>
);

// --- INTERNAL FORM FIELDS COMPONENT (Keep) ---
const ProductFormFields = ({ initialData, onSubmit }) => {
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

  useEffect(() => {
    if (initialData) {
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
        images: initialData.images?.length
          ? initialData.images
          : [{ url: "", alt: "" }],
      });
    }
  }, [initialData]);

  const categories = [
    "Pottery",
    "Textiles",
    "Painting",
    "Woodwork",
    "Metalwork",
    "Sculpture",
    "Jewelry",
    "Other",
  ];
  const statuses = ["draft", "active", "inactive"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("inventory.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "images.0.url") {
      setFormData((prev) => ({
        ...prev,
        images: [{ ...prev.images[0], url: value }],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert("Please enter a Product Name and select a Category first.");
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const response = await api.post("/ai/generate-description", {
        name: formData.name,
        category: formData.category,
      });
      setFormData((prev) => ({
        ...prev,
        description: response.data.description,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate description. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestPrice = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      alert(
        "Please provide a Name, Category, and Description before suggesting a price."
      );
      return;
    }
    setIsSuggestingPrice(true);
    setPriceSuggestion(null);
    setError("");
    try {
      const response = await api.post("/ai/suggest-price", {
        name: formData.name,
        category: formData.category,
        description: formData.description,
      });
      setPriceSuggestion(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to suggest price.");
    } finally {
      setIsSuggestingPrice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8 border border-gray-200"
    >
      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg font-medium border border-red-200">
          {error}
        </p>
      )}

      {/* --- Core Details Section --- */}
      <div className="space-y-6">
        <div className="pb-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-google-blue">Core Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            This is the essential information for your product listing.
          </p>
        </div>
        <FormInput
          label="Product Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Hand-Painted Ceramic Mug"
        />
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700"
            >
              Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-google-blue px-2 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SparklesIcon />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Tell a story about your product, its inspiration, and the creation process."
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm"
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="price"
                className="block text-sm font-bold text-gray-700"
              >
                Price (USD)
              </label>
              <button
                type="button"
                onClick={handleSuggestPrice}
                disabled={isSuggestingPrice}
                className="flex items-center gap-1 text-xs font-semibold text-white bg-google-green px-2 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LightBulbIcon />
                {isSuggestingPrice ? "Analyzing..." : "Suggest Price"}
              </button>
            </div>
            <FormInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 50.00"
            />
            {priceSuggestion && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <p className="font-bold text-yellow-800">
                  AI Suggestion: ${priceSuggestion.suggestedPriceRange}
                </p>
                <p className="text-yellow-700">
                  {priceSuggestion.justification}
                </p>
              </div>
            )}
          </div>
          <FormSelect
            label="Category"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>

      {/* --- Inventory & Status Section --- */}
      <div className="space-y-6">
        <div className="pb-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-google-green">
            Inventory & Status
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage stock levels and visibility on the marketplace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <FormInput
              label="Available Quantity"
              id="inventory.quantity"
              name="inventory.quantity"
              type="number"
              value={formData.inventory.quantity}
              onChange={handleChange}
              min="0"
              disabled={formData.inventory.isUnlimited}
            />
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="inventory.isUnlimited"
                name="inventory.isUnlimited"
                checked={formData.inventory.isUnlimited}
                onChange={handleChange}
                className="h-4 w-4 text-google-blue border-gray-300 rounded focus:ring-google-blue"
              />
              <label
                htmlFor="inventory.isUnlimited"
                className="ml-3 block text-sm text-gray-800"
              >
                Made to order (Unlimited Quantity)
              </label>
            </div>
          </div>
          <FormSelect
            label="Product Status"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>

      {/* --- Product Images Section --- */}
      <div className="space-y-6">
        <div className="pb-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-google-yellow">
            Product Images
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A great picture is worth a thousand sales. Provide a URL for now.
          </p>
        </div>
        <div className="mt-1">
          <FormInput
            label="Primary Image URL"
            id="images.0.url"
            name="images.0.url"
            type="text"
            value={formData.images[0].url}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
            required // Ensure at least one image URL is provided
          />
           {/* You could add more image inputs here later */}
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200">
        <button
          type="button"
          onClick={() => navigate("/artisan/products")}
          // Consistent secondary button style
          className="bg-gray-100 text-gray-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formLoading}
          // Consistent primary button style
          className="bg-google-blue text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formLoading
            ? "Saving..."
            : initialData
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

// --- MAIN PAGE COMPONENT ---
const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  // const { user, logout } = useAuth(); // Removed

  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // Start loading true
  const [pageError, setPageError] = useState("");

  const isEditMode = !!productId;

  useEffect(() => {
    // Only fetch if in edit mode
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${productId}`);
          setInitialData(response.data);
          setPageError(''); // Clear error on successful fetch
        } catch (err) {
          setPageError('Failed to fetch product data. Please check the ID or try again.');
          console.error(err);
          setInitialData(null); // Clear initial data on error
        } finally {
          setPageLoading(false);
        }
      };
      fetchProduct();
    } else {
        // If creating new, stop loading immediately
        setPageLoading(false);
        setInitialData(null); // Ensure no old data persists
    }
  }, [productId, isEditMode]); // Depend on productId and isEditMode

  const handleFormSubmit = async (formData) => {
    // --- Data cleaning and type conversion ---
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: {
        ...formData.inventory,
        // Ensure quantity is a number, default to 0 if invalid or unlimited
        quantity: formData.inventory.isUnlimited ? 0 : parseInt(formData.inventory.quantity, 10) || 0,
      },
      // Filter out empty images and ensure alt text exists
      images: formData.images
        .filter((img) => img.url && img.url.trim() !== '')
        .map(img => ({ url: img.url, alt: img.alt || formData.name || 'Product Image' })), // Add default alt text
    };

    // Basic validation before sending
    if (isNaN(payload.price) || payload.price < 0) {
      throw new Error("Invalid price entered.");
    }
    if (!formData.inventory.isUnlimited && (isNaN(payload.inventory.quantity) || payload.inventory.quantity < 0)) {
       throw new Error("Invalid quantity entered.");
    }
    if (payload.images.length === 0) {
      throw new Error("At least one valid image URL is required.");
    }


    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/products/${productId}`, payload);
        // Use Snackbar here instead of alert
        console.log("Product updated successfully!");
        // alert("Product updated successfully!"); 
      } else {
        response = await api.post("/products", payload);
         // Use Snackbar here instead of alert
        console.log("Product created successfully!");
       // alert("Product created successfully!");
      }
      navigate("/artisan/products"); // Redirect after success
    } catch (error) {
      console.error("Failed to submit form:", error);
      // Try to get a specific error message from the backend response
      const backendError = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message;
      throw new Error( backendError || "Failed to save product. Please check your input and try again.");
    }
  };
  
  // --- Loading State ---
  // Renders only when fetching data in edit mode
  if (pageLoading && isEditMode) {
    return (
        // Simple loading indicator centered
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <div className="text-xl font-semibold text-google-blue animate-pulse">Loading Product Details...</div>
        </div>
    );
  }

  // --- Error State ---
  // Renders if fetching data failed in edit mode
  if (pageError && isEditMode) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-red-500 mb-6">{pageError}</p>
            <button
              onClick={() => navigate('/artisan/products')}
              className="bg-google-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Products
            </button>
        </div>
    );
  }

  // --- Main Return (Form is always rendered for create, or after load/error check for edit) ---
  return (
    <>
      {/* <ArtisanHeader ... /> Removed */}

      {/* Page content wrapper with padding */}
      {/* Using container mx-auto for forms is often good for readability on wide screens */}
      <div className="container mx-auto px-6 py-12"> {/* Reduced py-16 to py-12 */}
        <AnimatedSection className="mb-8"> {/* Reduced mb-12 to mb-8 */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-google-blue hidden sm:block flex-shrink-0">
                <PencilAltIcon /> {/* Icon stays */}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="mt-1 text-gray-600 text-sm md:text-base">
                  {isEditMode
                    ? `Update the details for "${initialData?.name || "your product"}".` // Updated text
                    : "Fill out the form below to add a new creation to your portfolio."}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          {/* Pass initialData (which could be null for create mode) */}
          <ProductFormFields
            initialData={initialData} 
            onSubmit={handleFormSubmit}
          />
        </AnimatedSection>
      </div>

      {/* <Footer /> Removed */}
    </>
  );
};

export default ProductEditPage;