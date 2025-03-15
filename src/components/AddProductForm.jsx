import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function AddProductForm({ onClose, onProductAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const productData = {
      seller_id: userId, // Use userId from AuthContext
      name: name,
      description: description,
      price: parseFloat(price), // Ensure price is a number
      category: category,
      // Add any other relevant fields here based on your products table schema
    };

    try {
      const { data, error } = await supabase
        .from('products') // Replace 'products' with your actual table name
        .insert([productData])
        .select(); // To get the newly created record back

      if (error) {
        console.error("Supabase error:", error);
        setError(`Failed to add product: ${error.message}`);
      } else if (data && data.length > 0) {
        setSuccessMessage("Product added successfully!");
        // Optionally, call a function to refresh the product list in MyProducts
        if (onProductAdded) {
          onProductAdded(data[0]); // Pass the new product data back to MyProducts
        }
        // Reset form fields after successful submission
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setTimeout(onClose, 1500); // Close the form after 1.5 seconds
      } else {
        setError("Failed to add product: No data returned from Supabase.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred while adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto"> {/* ADDED overflow-y-auto */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md max-h-screen overflow-y-auto"> {/* REMOVED w-full, ADDED max-h-screen and overflow-y-auto */}
        <h2 className="text-lg font-bold mb-4">Add New Product</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green focus:ring-agri-green sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green focus:ring-agri-green sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green focus:ring-agri-green sm:text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green focus:ring-agri-green sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
