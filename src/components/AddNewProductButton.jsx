import React from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AddNewProductButton({ onClick }) { // Ensure onClick prop is being received
  const handleClick = () => {
    console.log('AddNewProductButton clicked'); // ADDED CONSOLE.LOG INSIDE COMPONENT
    if (onClick) {
      onClick(); // Call the onClick prop if it exists
    }
  };

  return (
    <motion.button
      className="bg-agri-green text-white py-1.5 rounded-lg shadow-md flex items-center justify-center space-x-1 hover:bg-green-700 transition-colors w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} // Attach handleClick to the button's onClick
    >
      <FiPlusCircle className="text-base" />
      <span className="font-bold text-sm">Add New Product</span>
    </motion.button>
  );
}
