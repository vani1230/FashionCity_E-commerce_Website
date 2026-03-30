import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiUser, FiPackage, FiMapPin, FiSettings, FiLogOut } from "react-icons/fi";
import { LogoutUser } from "../../store/auth-slice/index.js";

// Import your newly split components
import Address from '../shopping-view/Address.jsx';
import Settings from '../shopping-view/Settings.jsx';
import Orders from '../shopping-view/Order.jsx';

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(LogoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        navigate("/auth/login");
      } else {
        toast.error("Logout failed ❌");
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">My Profile</h2>
            <div className="bg-white/50 backdrop-blur-md border border-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-lg border-4 border-white shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-4 w-full mt-2 sm:mt-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-xl font-bold text-gray-800">{toTitleCase(user?.name) || "Guest User"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-xl font-bold text-gray-800 break-all">{user?.email || "No email provided"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Role</p>
                  <p className="text-sm font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 capitalize mt-1">{user?.role || "User"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return <Orders />;
      case "addresses":
        return <Address />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 relative pt-6 pb-12 overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] left-[-10%] w-[30rem] h-[30rem] bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-6 sm:mb-10 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 tracking-tight">
            My Account
          </h1>
          <p className="text-gray-600 font-medium mt-2">Manage your profile, orders, and addresses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-purple-200/40 p-2 sm:p-4 sticky top-24">
              <div className="flex lg:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
                <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-white/80 hover:text-pink-500"}`}>
                  <FiUser size={18} /> <span className="hidden sm:block lg:block">Profile</span><span className="sm:hidden">Profile</span>
                </button>
                <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === "orders" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-white/80 hover:text-pink-500"}`}>
                  <FiPackage size={18} /> <span className="hidden sm:block lg:block">Orders</span><span className="sm:hidden">Orders</span>
                </button>
                <button onClick={() => setActiveTab("addresses")} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === "addresses" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-white/80 hover:text-pink-500"}`}>
                  <FiMapPin size={18} /> <span className="hidden sm:block lg:block">Addresses</span><span className="sm:hidden">Addresses</span>
                </button>
                <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === "settings" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-white/80 hover:text-pink-500"}`}>
                  <FiSettings size={18} /> <span className="hidden sm:block lg:block">Settings</span><span className="sm:hidden">Settings</span>
                </button>
                <div className="hidden lg:block h-px bg-gray-200/50 my-2 mx-2"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm sm:text-base text-red-500 hover:bg-red-50 transition-all whitespace-nowrap">
                  <FiLogOut size={18} /> <span className="hidden sm:block lg:block">Logout</span><span className="sm:hidden">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-purple-200/40 p-5 sm:p-8 min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
        
        <button onClick={() => navigate('/shop/listing')} className="mt-8 bg-white/60 backdrop-blur-md border border-white text-pink-600 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-white hover:-translate-y-1 transition-all">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Account;