import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Timer = ({ minutes }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // Convert minutes to seconds

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (timeLeft <= 0) {
    return <span className="text-white text-xs font-bold">Time's up!</span>;
  }

  const displayMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const formattedTime = `${String(displayMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return (
    <span className="text-white text-xs font-bold">{formattedTime}</span>
  );
};

export default function MyOrders() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [orders, setOrders] = useState([]); // State to hold orders from Supabase
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // Get userId from AuthContext

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Modified Supabase query to fetch Time_to_Pack
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            Time_to_Pack,
            order_items (
              *,
              products (
                name
              )
            )
          `)
          .eq('seller_id', userId); // Filter orders by seller_id (user's profile ID)

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          // Sort orders to place "New" status orders at the beginning
          const sortedOrders = data.sort((a, b) => {
            if (a.status === 'New' && b.status !== 'New') {
              return -1; // a comes before b
            }
            if (a.status !== 'New' && b.status === 'New') {
              return 1; // b comes before a
            }
            return 0; // No change in order
          });
          setOrders(sortedOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Fetch orders only if userId is available
      fetchOrders();
    }
  }, [userId]);

  const handleAccept = (orderId) => {
    console.log(`Accepting order: ${orderId}`);
  };

  const handlePack = (orderId) => {
    console.log(`Packing order: ${orderId}`);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (!order || !order.order_items) return false;

    const query = searchQuery.toLowerCase();
    const itemMatch = order.order_items.some(item =>
      item.products?.name?.toLowerCase().includes(query)
    );
    const orderIdMatch = order.order_number.toLowerCase().includes(query);
    const statusMatch = activeTab === 'All' || order.status === activeTab;
    return statusMatch && (itemMatch || orderIdMatch);
  });


  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

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

  if (loading) {
    return <div>Loading Orders...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-lg">My Orders</h2>
        <div className="flex items-center space-x-2">
          {searchOpen ? (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search orders..."
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

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {['All', 'New', 'Pending', 'Shipped', 'Delivered'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab ? 'text-agri-green border-b-2 border-agri-green' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        {paginatedOrders.map(order => (
          <div key={order.id} className="bg-agri-gray rounded-lg relative">
            {(order.status === "New" || order.status === "Pending") && (
              <div className="absolute top-0 left-0 w-full h-8 bg-red-600 flex items-center justify-between px-3 rounded-t-lg">
                <span className="text-[0.7rem] text-white">Time Left to Pack Order:</span>
                <div className='flex items-center gap-2'>
                  <Timer minutes={order.Time_to_Pack} /> {/* Use Time_to_Pack from order data */}
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="2"/>
                    <line x1="10" y1="10" x2="10" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="10" y1="10" x2="4" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" className="animate-clock-minute"/>
                  </svg>
                </div>
              </div>
            )}

            <div className="p-3 pt-10 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">{order.order_number}</div>
                  <div className="text-xs text-gray-500">{order.order_date}</div>
                </div>
                <span className={`inline-block ${getStatusBgColor(order.status)} text-white text-[0.6rem] px-2 py-0.5 rounded-full font-semibold`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1">
                {order.order_items && order.order_items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-xs">{item.products.name}</span>
                    <span className="text-[0.65rem] text-gray-500 ml-2">x {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Total:</span>
                  <span className="text-xs font-semibold">₹{order.total_amount}</span>
                </div>
                {order.status !== "Shipped" && (
                  <>
                    {order.status === "New" && (
                      <button
                        onClick={() => handleAccept(order.order_number)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Accept
                      </button>
                    )}
                    {order.status !== "New" && order.status !== "Delivered" && (
                      <button
                        onClick={() => handlePack(order.order_number)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Pack
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center p-3 border-t border-gray-100">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

const getStatusBgColor = (status) => {
  switch (status) {
    case "New":
      return "bg-green-500";
    case "Pending":
      return "bg-orange-500";
    case "Shipped":
      return "bg-blue-500";
    case "Delivered":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};
