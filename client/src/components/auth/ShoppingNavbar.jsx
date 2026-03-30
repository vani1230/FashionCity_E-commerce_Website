import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMenu,
  FiX,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
  FiHome,
  FiWatch,
  FiShoppingCart
} from "react-icons/fi";
import { FaMale, FaFemale, FaChild, FaHeart } from "react-icons/fa";
import { GiRunningShoe } from "react-icons/gi";
import { LiaHeartSolid } from "react-icons/lia";

import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../store/auth-slice/index.js";
import { toast } from "sonner";

const AuthLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() || "?";
    return (words[0][0] || "").toUpperCase() + (words[1][0] || "").toUpperCase();
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(LogoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message || "Something went wrong ❌");
      }
    });
  };

  const cartItems = useSelector((state) => state.cart.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishListCount = wishlistItems.length;
  
  return (
    <div className="font-sans selection:bg-pink-300 selection:text-whitee">
      
      {/* 🌟 GLASSMORPHISM NAVBAR 🌟 */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex justify-between items-center transition-all">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 tracking-tight">
          <FiShoppingBag className="text-pink-500" />
          Fashion City
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-6 font-semibold text-gray-600">
          <Link to="/shop/listing" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <FiHome /> All
          </Link>
          <Link to="/shop/listing?category=Men" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <FaMale /> Men
          </Link>
          <Link to="/shop/listing?category=Women" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <FaFemale /> Women
          </Link>
          <Link to="/shop/listing?category=Kids" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <FaChild /> Kids
          </Link>
          <Link to="/shop/listing?category=Footwear" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <GiRunningShoe /> Footwear
          </Link>
          <Link to="/shop/listing?category=Accessories" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <FiWatch /> Accessories
          </Link>
        </ul>

        {/* RIGHT ICONS */}
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
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-sm rounded-full"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white shadow-md">
                {user?.name ? getInitials(user.name) : <span className="animate-pulse">...</span>}
              </div>
            </button>

            {/* Glassmorphism Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-purple-200/50 p-2 z-[100] animate-in fade-in zoom-in duration-200">
                <Link to='/account' className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-gray-700 font-medium transition-colors">
                  <FiUser className="text-pink-500" /> My Account
                </Link>
                {/* <Link className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-gray-700 font-medium transition-colors">
                  <FiPackage className="text-purple-500" /> Orders
                </Link>
                <Link className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-gray-700 font-medium transition-colors">
                  <FiSettings className="text-teal-500" /> Settings
                </Link> */}
                <div className="h-px bg-gray-200 my-1 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold transition-colors"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-2xl text-gray-600 hover:text-pink-500 transition-colors"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (Glassmorphism Slide down) */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[60px] sm:top-[72px] left-0 w-full bg-white/90 backdrop-blur-2xl border-b border-white shadow-xl p-5 flex flex-col gap-2 font-semibold text-gray-700 z-40 animate-in slide-in-from-top-2">
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <FiHome /> All
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing?category=Men" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <FaMale /> Men
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing?category=Women" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <FaFemale /> Women
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing?category=Kids" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <FaChild /> Kids
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing?category=Footwear" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <GiRunningShoe /> Footwear
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/shop/listing?category=Accessories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition">
            <FiWatch /> Accessories
          </Link>
          <div className="h-px bg-gray-200 my-2 mx-2"></div>
          <Link onClick={()=>setMenuOpen(false)} to="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-pink-500 transition">
            <FaHeart /> Wishlist ({wishListCount})
          </Link>
          <Link onClick={()=>setMenuOpen(false)} to="/cart" className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-purple-500 transition">
             <FiShoppingCart /> Cart ({cartCount})
          </Link>
        </div>
      )}

      {/* PAGE CONTENT (Renders Home.jsx, Cart.jsx, etc.) */}
      <div className="flex-1 flex flex-col relative">
        <Outlet />
      </div>

    </div>
  );
};

export default AuthLayout;