import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'

export default function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: topSellingProductsData, error: topSellingProductsError } = await supabase
          .from('top_selling_products')
          .select('*, products(*)') // Join with the products table
          .order('ranking', { ascending: true }) // Order by ranking

        if (topSellingProductsError) {
          setError(topSellingProductsError)
        } else {
          // Extract product data from the joined result
          const products = topSellingProductsData.map(item => ({
            ...item.products,
            sales_count: item.sales_count, // Optionally include sales_count if needed
            ranking: item.ranking,         // Optionally include ranking if needed
          }));
          setTopProducts(products)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopSellingProducts()
  }, [])

  if (loading) {
    return <p>Loading top selling products...</p>
  }

  if (error) {
    return <p>Error loading top selling products: {error.message}</p>
  }

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-bold text-lg p-3 border-b border-gray-100">Top Selling Products</h2>
      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  )
}
