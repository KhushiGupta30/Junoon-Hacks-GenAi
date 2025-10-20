import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  PlusIcon,
  TagIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from "../../components/common/Icons";

const SkeletonBase = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);
const SkeletonTableRow = () => (
  <tr className="border-b border-gray-100">
    <td className="p-4">
      <div className="flex items-center space-x-4">
        <SkeletonBase className="w-12 h-12 rounded-md flex-shrink-0" />
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-3 w-16" />
        </div>
      </div>
    </td>
    <td className="p-4 text-center">
      <SkeletonBase className="h-5 w-16 rounded-full mx-auto" />
    </td>
    <td className="p-4 text-right">
      <SkeletonBase className="h-4 w-12 ml-auto" />
    </td>
    <td className="p-4 text-right">
      <SkeletonBase className="h-4 w-20 ml-auto" />
    </td>
    <td className="p-4 text-right">
      <div className="flex justify-end space-x-2">
        <SkeletonBase className="h-7 w-12 rounded-md" />
        <SkeletonBase className="h-7 w-16 rounded-md" />
      </div>
    </td>
  </tr>
);
const SkeletonSidebarCard = ({ height = "h-48" }) => (
  <SkeletonBase className={`rounded-xl ${height}`} />
);
const SkeletonButton = () => (
  <SkeletonBase className="h-10 w-full rounded-lg" />
);

const ProductRow = React.memo(
  (
    { product, onDelete } 
  ) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={
              product.images[0]?.url ||
              "https://placehold.co/100x100/CCCCCC/FFFFFF?text=N/A"
            }
            alt={product.name}
            className="w-10 h-10 object-cover rounded flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-800 truncate">
              {product.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
            product.status === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : product.status === "draft"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-medium text-gray-700">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right text-gray-600">
        {product.inventory.isUnlimited
          ? "Made to Order"
          : product.inventory.quantity}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end space-x-1">
          {" "}
          <Link
            to={`/artisan/products/edit/${product._id}`}
            className="p-1.5 text-gray-500 hover:text-google-blue hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Product"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Product"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
); 

const MyProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setError("");
    try {
      const response = await api.get("/users/my-products");
      setProducts(
        Array.isArray(response.data.products) ? response.data.products : []
      );
    } catch (err) {
      setError("Failed to fetch your products. Please try again.");
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {

    }
  }, []); 

  useEffect(() => {
    let isMounted = true; 
    setLoading(true); 
    fetchProducts().finally(() => {
      if (isMounted) {
        setLoading(false); 
      }
    });
    return () => {
      isMounted = false;
    }; 
  }, [fetchProducts]); 

  const handleDelete = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      const originalProducts = [...products]; 
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== productId)
      );
      setError("");
      try {
        await api.delete(`/products/${productId}`);
        console.log("Product deleted successfully.");
      } catch (err) {
        setProducts(originalProducts);
        setError("Failed to delete product. Please try again.");
        console.error("Delete product error:", err);
      }
    }
  };

  const { lowStockItems, quickStats } = useMemo(() => {
    const lowStockThreshold = 5;
    const lowStock = products.filter(
      (p) =>
        !p.inventory.isUnlimited && p.inventory.quantity < lowStockThreshold
    );
    const stats = {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      draft: products.filter((p) => p.status === "draft").length,
      inactive: products.filter((p) => p.status === "inactive").length,
    };
    return { lowStockItems: lowStock, quickStats: stats };
  }, [products]);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        <div className="flex-grow space-y-8">
          <SkeletonBase className="h-10 w-3/4 mb-4" /> 
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 animate-pulse" />{" "}
        </div>
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <SkeletonButton />
          <SkeletonSidebarCard height="h-64" />
          <SkeletonSidebarCard height="h-48" />
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
        <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-6">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            fetchProducts();
          }}
          className="inline-flex items-center px-4 py-2 bg-google-blue text-white rounded-md text-sm hover:brightness-95"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      <div className="flex-grow lg:w-2/3">
        <AnimatedSection className="mb-8 pt-8 text-center">
          <h1
            className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
            style={{
              background: "linear-gradient(90deg, #f66356ff, #DB4437)",
              color: "#FFFFFF",
            }}
          >
            My Products
          </h1>
          <p className="mt-3 text-gray-700 text-sm">
            Manage your creations available on the marketplace.
          </p>
        </AnimatedSection>

        {error && products.length > 0 && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-200 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-900"
            >
              &times;
            </button>
          </div>
        )}

        <AnimatedSection>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/70 border-b border-gray-200">
                    <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <ProductRow
                        key={product._id}
                        product={product}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !error && (
                <div className="text-center py-16 px-6">
                  <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                    <TagIcon className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-700">
                    No Products Yet!
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    Click the "Add New Product" button in the sidebar to start
                    selling.
                  </p>
                </div>
              )
            )}
          </div>
        </AnimatedSection>
      </div>

      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
        <AnimatedSection>
          <button
            onClick={() => navigate("/artisan/products/new")}
            className="w-full flex items-center justify-center bg-google-blue text-white font-bold px-4 py-3 rounded-lg hover:bg-opacity-90 transition-colors shadow-md text-sm" // Prominent button
          >
            <PlusIcon className="w-5 h-5 mr-1.5" />
            Add New Product
          </button>
        </AnimatedSection>

        <AnimatedSection>
          <div
            className={`rounded-xl shadow-sm border ${
              lowStockItems.length > 0
                ? "bg-red-50/60 border-red-200/80"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <ExclamationTriangleIcon
                className={`h-6 w-6 ${
                  lowStockItems.length > 0 ? "text-red-500" : "text-gray-400"
                }`}
              />
              <h3 className="text-base font-medium text-gray-800">
                Low Inventory
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <Link
                    to={`/artisan/products/edit/${item._id}`}
                    key={item._id}
                    className="block p-4 hover:bg-red-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-800 leading-snug flex-1 pr-2">
                        {item.name}
                      </p>
                      <span className="text-sm font-bold text-red-600 flex-shrink-0">
                        {item.inventory.quantity} left
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.category}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6 text-xs px-4">
                  All products are sufficiently stocked.
                </p>
              )}
            </div>
            {lowStockItems.length > 0 && (
              <div className="p-3 text-center bg-gray-50/70 rounded-b-xl border-t border-gray-100">
                <Link
                  to="/artisan/products?filter=low_stock"
                  className="text-google-blue text-xs font-medium hover:underline"
                >
                  View all low stock
                </Link>
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <InformationCircleIcon className="h-6 w-6 text-gray-500" />
              <h3 className="text-base font-medium text-gray-800">
                Product Summary
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Products:</span>
                <span className="font-semibold text-gray-800">
                  {quickStats.total}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active Listings:</span>
                <span className="font-semibold text-green-700">
                  {quickStats.active}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Drafts:</span>
                <span className="font-semibold text-yellow-700">
                  {quickStats.draft}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Inactive:</span>
                <span className="font-semibold text-gray-500">
                  {quickStats.inactive}
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </aside>
    </div>
  );
};

export default MyProductsPage;
