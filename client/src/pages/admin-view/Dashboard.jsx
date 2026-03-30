import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  X, 
  Users,  
  ShoppingCart, 
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PiCurrencyInrBold } from "react-icons/pi";

import { useDispatch, useSelector } from "react-redux";
// Make sure this path matches your project structure
import {
  fetchDashboardDataThunk,
  fetchUsersThunk,
} from '../../store/dashboard-slice/Index.js';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { dashboard, loading, error, usersList = [] } = useSelector(
    (state) => state.dashboard
  );

  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardDataThunk());
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  // Safe fallbacks for data
  const revenue = dashboard?.totalRevenue || 0;
  const orders = dashboard?.totalOrders || 0;
  const users = dashboard?.totalUsers || 0;
  const recentOrders = dashboard?.recentOrders || [];

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-blue-600">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-500">
        <AlertCircle size={40} className="mb-4" />
        <p className="font-medium">Failed to load dashboard data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Overview Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your store's performance and users.</p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`₹${revenue.toLocaleString()}`} 
            icon={<PiCurrencyInrBold size={22} className="text-emerald-500" />}
          />

          <StatCard 
            title="Total Orders" 
            value={orders} 
            icon={<ShoppingCart size={22} className="text-blue-500" />}
            onClick={()=>navigate('/admin/orders')}
          />

          {/* CLICKABLE USERS CARD */}
          <StatCard
            title="Total Users"
            value={users}
            icon={<Users size={22} className="text-indigo-500" />}
            onClick={() => setShowUsersModal(true)}
            isClickable={true}
          />

          <StatCard
            title="Pending Orders"
            value={recentOrders.filter(o => o.orderStatus?.toLowerCase() === "pending").length}
            icon={<Clock size={22} className="text-amber-500" />}
          />
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow 
                      key={order._id}
                      id={order._id?.substring(0, 8).toUpperCase() || "N/A"} 
                      name={order.user?.name || "Guest"} 
                      date={new Date(order.createdAt).toLocaleDateString()} 
                      status={formatStatus(order.orderStatus)} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* USERS MODAL */}
        {showUsersModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users size={20} className="text-indigo-500" />
                  User Directory
                </h2>
                <button
                  onClick={() => {
                    setShowUsersModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                {/* User List */}
                <div className="w-full sm:w-1/2 border-r border-gray-100 overflow-y-auto p-4 space-y-2 max-h-64 sm:max-h-full">
                  {usersList.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No users found</p>
                  ) : (
                    usersList.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${
                          selectedUser?._id === user._id 
                            ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                            : "bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50"
                        }`}
                      >
                        <p className={`font-semibold ${selectedUser?._id === user._id ? "text-indigo-700" : "text-gray-800"}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* User Details */}
                <div className="w-full sm:w-1/2 p-6 bg-gray-50/30 overflow-y-auto flex flex-col justify-center">
                  {selectedUser ? (
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                        {selectedUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Profile Details</h3>
                      <div className="space-y-3 text-sm">
                        <p className="flex flex-col">
                          <span className="text-gray-400 text-xs uppercase tracking-wider">Full Name</span>
                          <span className="font-medium text-gray-800">{selectedUser.name}</span>
                        </p>
                        <p className="flex flex-col">
                          <span className="text-gray-400 text-xs uppercase tracking-wider">Email Address</span>
                          <span className="font-medium text-gray-800">{selectedUser.email}</span>
                        </p>
                        <p className="flex flex-col">
                          <span className="text-gray-400 text-xs uppercase tracking-wider">System ID</span>
                          <span className="font-mono text-gray-600 bg-gray-100 p-1 rounded mt-1 text-xs break-all">
                            {selectedUser._id}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 flex flex-col items-center">
                      <Users size={48} className="text-gray-200 mb-3" />
                      <p>Select a user from the list to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;

/* --- Subcomponents --- */

const StatCard = ({ title, value, onClick, icon, isClickable }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-200 ${
      isClickable ? "cursor-pointer hover:shadow-md hover:border-indigo-200 hover:-translate-y-1" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon || <TrendingUp size={20} className="text-gray-400" />}
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const TableRow = ({ id, name, date, status }) => {
  const statusStyles = {
    Delivered: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Shipped: "bg-blue-100 text-blue-700",
    Paid: "bg-purple-100 text-purple-700",
    Processing: "bg-indigo-100 text-indigo-700",
    Cancelled: "bg-red-100 text-red-700"
  };

  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-800">{id}</td>
      <td className="px-6 py-4 text-gray-600">{name}</td>
      <td className="px-6 py-4 text-gray-500">{date}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            statusStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

const formatStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};