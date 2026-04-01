import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiShoppingBag,
  FiShoppingCart,
  FiList
} from "react-icons/fi";
import { LiaHeartSolid } from "react-icons/lia";

import { useDispatch, useSelector } from "react-redux";
import { LogoutUser, resetTokenAndCredentials } from "../../store/auth-slice/index.js";
import { toast } from "sonner";

const HomePageNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishListCount = wishlistItems.length;

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() || "?";
    return (words[0][0] || "").toUpperCase() + (words[1][0] || "").toUpperCase();
  };

  const handleLogout = async () => {
    // dispatch(LogoutUser()).then((data) => {
    //   if (data?.payload?.success) {
      //     navigate("/auth/login");
      //   } else {
        //     toast.error(data?.payload?.message || "Something went wrong ❌");
        //   }
        // });
        dispatch(resetTokenAndCredentials())
        sessionStorage.clear()
        navigate('/auth/login')
        toast.success("Logged Out Successfully");
  };

  return (
    <div className="font-sans selection:bg-pink-300 selection:text-white">
      {/* 🌟 GLASSMORPHISM NAVBAR 🌟 */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/50 shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 tracking-tight z-50">
            <FiShoppingBag className="text-pink-500" />
            Fashion City
          </Link>

          {/* DESKTOP LINKS & ICONS */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* WISHLIST */}
            <Link to="/wishlist" className="relative text-gray-600 hover:text-pink-500 text-2xl transition hover:scale-110 active:scale-95">
              <LiaHeartSolid />
              {wishListCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-[2px] rounded-full shadow-md border border-white">
                  {wishListCount}
                </span> 
              )}
            </Link>

            {/* CART */}
            <Link to="/cart" className="relative text-gray-600 hover:text-purple-500 text-xl sm:text-2xl transition hover:scale-110 active:scale-95">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-gradient-to-r from-purple-500 to-teal-400 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-[2px] rounded-full shadow-md border border-white">
                  {cartCount}
                </span> 
               )}
            </Link>

            {/* PROFILE DROPDOWN */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-sm rounded-full"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white shadow-md">
                  {user?.name ? getInitials(user.name) : <span className="animate-pulse">...</span>}
                </div>
              </button>

              {/* Glassmorphism Profile Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-purple-200/50 p-2 z-[100] animate-in fade-in zoom-in duration-200">
                  <Link to='/account' onClick={() => setProfileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-gray-700 font-medium transition-colors">
                    <FiUser className="text-pink-500" /> My Account
                  </Link>
                  <div className="h-px bg-gray-200 my-1 mx-2"></div>
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold transition-colors"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-2xl text-gray-600 hover:text-pink-500 transition-colors z-50"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
             <Link to="/shop/listing" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-semibold text-lg p-2 hover:bg-pink-50 rounded-lg">
                <FiList className="text-pink-500"/> Shop All
             </Link>
             <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-semibold text-lg p-2 hover:bg-purple-50 rounded-lg">
                <FiUser className="text-purple-500"/> My Account
             </Link>
             <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-semibold text-lg p-2 hover:bg-red-50 rounded-lg text-left">
                <FiLogOut /> Logout
             </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default HomePageNavbar;