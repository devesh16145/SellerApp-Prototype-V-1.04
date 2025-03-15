import React, { useState, useEffect } from 'react';
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

export default function RecentOrders() {
  const [orders, setOrders] = useState([]); // State to hold orders from Supabase
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // Get userId from AuthContext

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
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
          .eq('seller_id', userId) // Filter orders by seller_id (user's profile ID)
          .limit(4); // Limit to recent orders

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
      console.log("Fetching orders with userId:", userId);
    }
  }, [userId]);

  const handleAccept = (orderId) => {
    console.log(`Accepting order: ${orderId}`);
  };

  const handlePack = (orderId) => {
    console.log(`Packing order: ${orderId}`);
  };

  if (loading) {
    return <div>Loading Recent Orders...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <h2 className="font-bold text-lg p-3 border-b border-gray-100">Recent Orders</h2>
      <div className="flex overflow-x-auto p-3 space-x-3">
        {orders.map(order => (
          <div key={order.id} className="min-w-[280px] bg-agri-gray rounded-lg relative">

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
