import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiArrowLeft, FiShoppingCart, FiTrash2, FiHeart } from "react-icons/fi";
import { addToCartAsync } from "../../store/cart-slice/index.js";
import { removeFromWishlistAsync } from "../../store/wishlist-slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: wishlistItems,
    isLoading,
    actionLoadingId,
  } = useSelector((state) => state.wishlist);

  /* 🛒 MOVE TO CART */
  const handleAddToCart = (product) => {
    dispatch(addToCartAsync(product));
    dispatch(removeFromWishlistAsync(product._id)); // 🔥 move behavior
    toast.success("Moved to cart 🛒");
  };

  /* ❌ REMOVE */
  const handleRemove = (id) => {
    dispatch(removeFromWishlistAsync(id));
    toast.success("Removed from wishlist ❌");
  };

  /* 💰 SAFE PRICE */
  const getPrice = (item) =>
    item?.salePrice && item.salePrice > 0 ? item.salePrice : item?.price || 0;

  return (
    // Vibrant pastel background with min-height (not fixed height, so we can scroll through products)
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 relative font-sans selection:bg-pink-300 selection:text-white pb-12">
      
      {/* Decorative Fixed Background Orbs - fixed so they stay in place while scrolling */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="fixed top-[40%] right-[-5%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 relative z-10 pt-4 sm:pt-6">
        
        {/* 🔥 HEADER (STICKY) - Glassmorphism */}
        <div className="sticky top-3 sm:top-4 z-40 bg-white/60 backdrop-blur-xl border border-white p-4 sm:p-5 mb-6 sm:mb-8 rounded-2xl shadow-lg shadow-purple-200/40 flex justify-between items-center transition-all">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-3 tracking-tight">
            <div className="bg-pink-100 p-2 rounded-full">
              <FiHeart className="text-pink-500 fill-pink-500" />
            </div>
            Wishlist
          </h1>

          <button
            onClick={() => navigate("/shop/listing")}
            className="group flex items-center gap-2 text-sm sm:text-base font-semibold bg-white/80 border border-white text-gray-700 px-4 py-2.5 rounded-xl hover:bg-white hover:text-pink-500 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden xs:inline">Continue Shopping</span>
            <span className="xs:hidden">Shop</span>
          </button>
        </div>

        {/* EMPTY STATE */}
        {!isLoading && wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 bg-white/50 backdrop-blur-md border border-white shadow-xl rounded-[2rem] p-10 max-w-lg mx-auto text-center">
            <div className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FiHeart className="text-pink-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">It's empty here!</h2>
            <p className="text-gray-500 mb-6">You haven't added any items to your wishlist yet.</p>
            <button 
               onClick={() => navigate("/home")}
               className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          
          /* GRID - Strictly 2 columns on mobile, scaling up to 5 on large screens */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {wishlistItems.map((item) => {
              return (
                /* PRODUCT CARD - Glassmorphism, smaller padding on mobile */
                <div
                  key={item._id}
                  className="bg-white/60 backdrop-blur-xl border border-white rounded-[1.25rem] sm:rounded-[1.5rem] shadow-lg shadow-purple-200/30 hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-1 transition-all duration-300 p-2.5 sm:p-4 flex flex-col group"
                >
                  {/* IMAGE - smaller height on mobile (h-36) vs desktop (h-56) */}
                  <div className="w-full h-36 sm:h-56 overflow-hidden rounded-xl mb-3 relative bg-gray-50">
                    <img
                      src={item.image.replace(
                        "/upload/",
                        "/upload/w_400,q_auto,f_auto/",
                      )}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Tiny visual overlay gradient to make image blend with glass theme */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  </div>

                  {/* TITLE - smaller text on mobile */}
                  <h2 className="text-xs sm:text-base font-bold text-gray-800 line-clamp-2 leading-tight">
                    {item.title}
                  </h2>

                  {/* PRICE */}
                  <div className="mt-1 sm:mt-2 flex items-center flex-wrap gap-1 sm:gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm sm:text-lg">
                      ₹{getPrice(item)}
                    </span>

                    {item.salePrice > 0 && (
                      <span className="text-gray-400 line-through text-[10px] sm:text-sm font-medium">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-auto flex gap-1.5 sm:gap-2 pt-3 sm:pt-4">
                    
                    {/* ADD TO CART */}
                    <button
                      disabled={actionLoadingId === item._id}
                      onClick={() => handleAddToCart(item)}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-sm
                      ${
                        actionLoadingId === item._id
                          ? "bg-white/50 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-300/50 hover:-translate-y-0.5 active:scale-95"
                      }`}
                    >
                      <FiShoppingCart className="text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm">
                        {actionLoadingId === item._id ? "..." : "Add"}
                      </span>
                    </button>

                    {/* REMOVE - Styled as a sleek glass icon button */}
                    <button
                      disabled={actionLoadingId === item._id}
                      onClick={() => handleRemove(item._id)}
                      className="flex items-center justify-center bg-red-50 text-red-500 border border-red-100 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-200 transition-all active:scale-95"
                    >
                      <FiTrash2 className="text-sm sm:text-base" />
                    </button>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;