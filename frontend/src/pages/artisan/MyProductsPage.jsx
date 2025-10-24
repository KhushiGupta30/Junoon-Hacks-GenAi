import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '../../components/common/Icons'; // Assuming you have these
import AnimatedSection from '../../components/ui/AnimatedSection';
import SkeletonListItem from '../../components/ui/SkeletonListItem'; // For loading

// --- ProductRow Component ---
// This is where the TypeError fix goes (around line 90)
const ProductRow = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/product/${product.id}`); // Or product._id
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr>
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            <img
              className="h-11 w-11 rounded-lg object-cover"
              src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="mt-1 text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
            product.status
          )}`}
        >
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
        {/*
          *
          * FIX 1 (TypeError):
          * Was: ${product.price.toFixed(2)}
          * Now: Parse price to a float before calling toFixed()
          *
          */}
        ${(parseFloat(product.price) || 0).toFixed(2)}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        {product.inventory?.isUnlimited ? (
          <span className="text-gray-700">Made to Order</span>
        ) : (
          <span className="text-gray-900">{product.inventory?.quantity ?? 0} in stock</span>
        )}
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={handleView}
            className="text-google-blue hover:text-blue-700"
            title="View Product"
          >
            <EyeIcon className="h-5 w-5" />
            <span className="sr-only">View</span>
          </button>
          <button
            onClick={onEdit}
            className="text-google-green hover:text-green-700"
            title="Edit Product"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="text-google-red hover:text-red-700"
            title="Delete Product"
          >
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};


// --- Main MyProductsPage Component ---
const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'All', 'Pottery', 'Textiles', 'Painting', 'Woodwork', 
    'Metalwork', 'Sculpture', 'Jewelry', 'Other'
  ];
  const statuses = ['All', 'Active', 'Draft', 'Inactive'];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/artisan/${user.id}/products`);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleEdit = (product) => {
    navigate(`/artisan/products/edit/${product.id}`); // Or product._id
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId)); // Or product._id
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const renderStats = () => (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Total Products</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{products.length}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Active Listings</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-google-green">{products.filter(p => p.status === 'active').length}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Drafts</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-google-yellow">{products.filter(p => p.status === 'draft').length}</dd>
      </div>
    </dl>
  );

  const renderFilters = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="relative">
        <label htmlFor="search" className="sr-only">Search</label>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-google-blue focus:ring-google-blue sm:text-sm"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        <label htmlFor="status" className="sr-only">Filter by status</label>
        <select
          id="status"
          name="status"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-google-blue focus:ring-google-blue sm:text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="category" className="sr-only">Filter by category</label>
        <select
          id="category"
          name="category"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-google-blue focus:ring-google-blue sm:text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderProductList = () => (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Product
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Status
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/*
                  *
                  * FIX 2 (Key Prop):
                  * Was: <ProductRow product={product} ... />
                  * Now: Add the 'key' prop with a unique ID from the product
                  *
                  */}
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id || product._id} // <-- FIX IS HERE
                    product={product}
                    onEdit={() => handleEdit(product)}
                    onDelete={() => handleDelete(product.id || product._id)}
                  />
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <p className="py-6 text-center text-gray-500">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatedSection className='pt-8'>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the products in your shop including their name, price, stock, and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/artisan/products/new"
              className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="space-y-4">
              <SkeletonListItem />
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
          ) : (
            <>
              {renderStats()}
              <div className="mt-8">{renderFilters()}</div>
              {renderProductList()}
            </>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default MyProductsPage;