import React from 'react';
import {
  FiUser,
  FiMapPin,
  FiFileText,
  FiBarChart,
  FiLifeBuoy,
  FiLogOut,
  FiShieldOff,
  FiFile,
  FiSettings,
  FiShare2,
  FiList,
  FiStar,
  FiChevronRight,
  FiMessageSquare,
  FiBookOpen,
  FiShoppingBag,
  FiFileMinus,
  FiTrendingUp,
  FiBook,
  FiSliders,
} from 'react-icons/fi';

export default function ProfilePage({ setActivePage, onLogout }) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-none shadow-sm border">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-1">My account</h2>
            <p className="text-gray-600">8130913368</p>
          </div>

          <div className="flex space-x-2 mb-4">
            <div className="flex-1 bg-agri-gray p-3 rounded-md flex flex-col items-center justify-center">
              <FiMessageSquare className="text-xl text-agri-green mb-1" />
              <span className="text-sm">Support</span>
            </div>
            <button
              onClick={() => setActivePage('sellerLeaderboard')}
              className="flex-1 bg-agri-gray p-3 rounded-md flex flex-col items-center justify-center"
            >
              <FiStar className="text-xl text-agri-green mb-1" />
              <span className="text-sm">Leaderboard</span>
            </button>
            <div className="flex-1 bg-agri-gray p-3 rounded-md flex flex-col items-center justify-center">
              <FiBookOpen className="text-xl text-agri-green mb-1" />
              <span className="text-sm">University</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">YOUR INFORMATION</h3>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => setActivePage('accountDetails')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiUser /></span>
                  <span>Account Details</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('addressDetails')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiMapPin /></span>
                  <span>Address Details</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('myBills')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiFileText /></span>
                  <span>My Bills</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('orderSummaryStats')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiBarChart /></span>
                  <span>Order Summary Stats</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('sellerSupport')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiLifeBuoy /></span>
                  <span>Seller Support</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('sellerLeaderboard')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiTrendingUp /></span>
                  <span>Seller Leaderboard</span>
                </div>
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ACCOUNT SETTINGS</h3>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => setActivePage('preferences')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiSliders /></span>
                  <span>Preferences</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('privacyPolicy')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiShieldOff /></span>
                  <span>Privacy Policy</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('termsCondition')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiFile /></span>
                  <span>Terms & Conditions</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('referApp')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiShare2 /></span>
                  <span>Refer App</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('myStatements')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiList /></span>
                  <span>My Statements</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={() => setActivePage('sellerScore')}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiStar /></span>
                  <span>Seller Score</span>
                </div>
                <FiChevronRight />
              </button>
              <button
                onClick={onLogout}
                className="flex w-full p-3 text-left hover:bg-agri-gray justify-between items-center text-red-500"
              >
                <div className="flex items-center">
                  <span className="mr-2"><FiLogOut /></span>
                  <span>Log Out</span>
                </div>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
