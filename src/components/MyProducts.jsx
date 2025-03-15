import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FiSearch, FiX } from 'react-icons/fi';
import AddNewProductButton from './AddNewProductButton';
import AddProductForm from './AddProductForm'; // Import AddProductForm
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function MyProducts() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [products, setProducts] = useState([]); // State to hold products from Supabase
  const [loading, setLoading] = useState(true);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State to control form visibility
  const { userId } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products') // Replace 'products' with your actual table name
          .select('*')
          .eq('seller_id', userId); // Fetch products for the current user

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data || []); // Ensure products is always an array
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProducts();
    }
  }, [userId]); // Fetch products when userId changes (on login/logout)

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setProductsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const openAddProductForm = () => {
    console.log('openAddProductForm function called'); // ADDED CONSOLE.LOG
    setShowAddProductForm(true);
  };

  const closeAddProductForm = () => {
    setShowAddProductForm(false);
  };

  const handleProductAdded = (newProduct) => {
    // Update the products list with the newly added product
    setProducts([newProduct, ...products]); // Add new product to the beginning of the list
    closeAddProductForm(); // Close the form after product is added
  };


  if (loading) {
    return <div>Loading Products...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-lg">My Products</h2>
        <div className="flex items-center space-x-2">
          {searchOpen ? (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
              <button onClick={toggleSearch} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-r-lg px-3 py-1">
                <FiX className="text-sm" />
              </button>
            </div>
          ) : (
            <button onClick={toggleSearch} className="bg-agri-green hover:bg-green-700 text-white rounded-full p-2">
              <FiSearch className="text-sm" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-3">
        <AddNewProductButton onClick={openAddProductForm} /> {/* Use the button and open form on click */}
        {showAddProductForm && (
          <AddProductForm onClose={closeAddProductForm} onProductAdded={handleProductAdded} />
        )}


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center p-3 border-t border-gray-100">
        <div>
          <span className="text-sm text-gray-700">
            Items per page:
          </span>
          <select
            className="ml-2 p-1 border border-gray-300 rounded-md text-sm focus:ring-agri-green focus:border-agri-green"
            value={productsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
