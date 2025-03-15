import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiRefreshCw } from 'react-icons/fi'; // Import icons

export default function SellerLeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [originalLeaderboardData, setOriginalLeaderboardData] = useState([]); // To hold original data for refresh/reset

  useEffect(() => {
    fetchLeaderboard();
  }, [userId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching leaderboard data...");

    try {
      if (!userId) {
        setError("User ID not found.");
        setLoading(false);
        console.log("User ID not found, cannot fetch leaderboard.");
        return;
      }
      console.log("User ID:", userId);

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });

      if (error) {
        setError(error);
        console.error("Supabase error fetching leaderboard:", error);
      } else {
        console.log("Raw Supabase data:", data);
        setLeaderboardData(data);
        setOriginalLeaderboardData(data); // Store the original data
        console.log("Leaderboard data fetched successfully:", data);
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
      console.log("Fetching leaderboard data completed.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (!originalLeaderboardData) {
      setOriginalLeaderboardData(leaderboardData);
    }
    if (query) {
      const filteredData = originalLeaderboardData.filter(seller =>
        seller.seller_name.toLowerCase().includes(query)
      );
      setLeaderboardData(filteredData);
    } else {
      setLeaderboardData(originalLeaderboardData); // Reset to original data when query is cleared
    }
  };

  const handleRefresh = () => {
    fetchLeaderboard();
    setSearchQuery(''); // Clear search query on refresh
  };


  if (loading) {
    console.log("Leaderboard is loading...");
    return <div className="p-4">Loading leaderboard data...</div>;
  }

  if (error) {
    console.error("Leaderboard error during render:", error);
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  console.log("Leaderboard rendering with data:", leaderboardData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Seller Leaderboard</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search seller..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-agri-green focus:border-agri-green sm:text-sm"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center space-x-2"
          >
            <FiRefreshCw /> <span>Refresh</span>
          </button>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales Volume
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((seller, index) => (
              <TableRow
                key={seller.id}
                seller={seller}
                index={index}
                isCurrentUser={seller.profile_id === userId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const TableRow = ({ seller, index, isCurrentUser }) => {
  const rowClassName = isCurrentUser ? 'bg-green-50' : 'hover:bg-gray-50';
  const rankBadgeClassName =
    index === 0 ? 'bg-yellow-500 text-white' :
    index === 1 ? 'bg-gray-400 text-white' :
    index === 2 ? 'bg-orange-400 text-white' :
    'bg-gray-100 text-gray-700';


  return (
    <tr className={`${rowClassName} transition-colors`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${rankBadgeClassName}`}>
          {index + 1}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{seller.seller_name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700">{seller.sku_count}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700">{seller.competitive_pricing_score}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700">₹{seller.sales_volume}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700">{seller.order_fulfillment_rate}%</div>
      </td>
    </tr>
  );
};
