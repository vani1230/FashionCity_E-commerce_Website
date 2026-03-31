import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
  FiCreditCard,
  FiArrowLeft,
  FiShoppingCart
} from "react-icons/fi";
import {
  clearCartAsync,
  decreaseQtyAsync,
  increaseQtyAsync,
  removeFromCartAsync,
} from "../../store/cart-slice/index.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const navigate = useNavigate();

  /* 🔥 TOTAL CALCULATION */
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCartAsync());
    toast.success("Cart cleared 🧹");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 relative font-sans selection:bg-pink-300 selection:text-white pb-24">
      
      {/* Decorative Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0 pointer-events-none"></div>
      <div className="fixed top-[40%] right-[-5%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 relative z-10 pt-4 sm:pt-6">
        
        {/* 🔥 HEADER (STICKY) */}
        <div className="sticky top-3 sm:top-4 z-50 bg-white/70 backdrop-blur-xl border border-white/80 p-4 sm:p-5 mb-6 sm:mb-8 rounded-2xl shadow-lg shadow-purple-200/40 flex justify-between items-center transition-all">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-3 tracking-tight">
            <div className="bg-purple-100 p-2 rounded-full shadow-inner">
              <FiShoppingBag className="text-purple-500 fill-purple-100" />
            </div>
            Your Cart
          </h1>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold bg-red-50/80 border border-red-100 text-red-500 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white shadow-sm hover:shadow-md hover:shadow-red-200 transition-all duration-300 active:scale-95"
            >
              <FiTrash2 className="group-hover:scale-110 transition-transform" /> 
              <span className="hidden xs:inline">Clear Cart</span>
              <span className="xs:hidden">Clear</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* 🔥 EMPTY STATE */
          <div className="flex flex-col items-center justify-center mt-10 sm:mt-20 bg-white/60 backdrop-blur-md border border-white shadow-xl rounded-[2rem] p-8 sm:p-10 max-w-lg mx-auto text-center">
             <div className="bg-purple-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FiShoppingCart className="text-purple-400 text-4xl sm:text-5xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your cart is empty 🥲</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">Looks like you haven't added anything yet.</p>

            <button
              onClick={() => navigate("/shop/listing")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
            >
              <FiArrowLeft /> Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* 🔥 LEFT SIDE (CART ITEMS) */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[1.25rem] sm:rounded-2xl shadow-lg shadow-purple-200/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3 sm:p-4 flex flex-row gap-3 sm:gap-4 group"
                  >
                    {/* IMAGE */}
                    <div className="w-24 h-28 sm:w-32 sm:h-32 overflow-hidden rounded-xl bg-gray-50 flex-shrink-0 relative shadow-inner">
                      <img
                        src={item.image.replace(
                          "/upload/",
                          "/upload/w_300,q_auto,f_auto/"
                        )}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        
                        {/* 🌟 FIX: Flex container for Title and Delete Button 🌟 */}
                        <div className="flex justify-between items-start gap-2">
                          <h2 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 leading-tight">
                            {item.title}
                          </h2>
                          
                          <button
                            onClick={() => dispatch(removeFromCartAsync(item._id))}
                            className="text-red-400 hover:text-red-600 bg-red-50/50 hover:bg-red-100 p-1.5 rounded-lg transition-all active:scale-95 flex-shrink-0"
                            title="Remove item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        {/* 🌟 END FIX 🌟 */}

                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                          {item.category} • {item.brand}
                        </p>

                        {/* PRICE */}
                        <div className="mt-1.5 sm:mt-2 flex items-center flex-wrap gap-1.5 sm:gap-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-base sm:text-lg">
                            ₹{item.salePrice > 0 ? item.salePrice : item.price}
                          </span>
                          {item.salePrice > 0 && (
                            <span className="text-gray-400 line-through text-[11px] sm:text-sm font-medium">
                              ₹{item.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CONTROLS */}
                      <div className="flex justify-between items-center mt-2 sm:mt-auto pt-2">
                        {/* QTY Adjuster */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-white/80 border border-white rounded-lg px-2 sm:px-3 py-1 shadow-sm">
                          <button
                            onClick={() => dispatch(decreaseQtyAsync(item._id))}
                            className="text-gray-500 hover:text-pink-500 transition-colors p-1"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="font-bold text-xs sm:text-sm text-gray-700 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQtyAsync(item._id))}
                            className="text-gray-500 hover:text-teal-500 transition-colors p-1"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 RIGHT SIDE SUMMARY */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0 mt-4 lg:mt-0">
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[1.5rem] shadow-xl shadow-purple-200/40 p-6 sm:p-8 relative lg:sticky lg:top-28 transition-all">
                <h2 className="text-xl font-extrabold mb-5 text-gray-800 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm sm:text-base font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Total Items</span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-white shadow-sm text-gray-800">{totalItems}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-gray-800 font-semibold">₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 font-bold text-xs sm:text-sm shadow-sm">Free</span>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-300/30"></div>

                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-500">Total</span>
                  <span className="font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    ₹{totalPrice}
                  </span>
                </div>

                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 transition-all duration-300" onClick={() => navigate("/checkout")}>
                  <FiCreditCard size={18} /> Secure Checkout
                </button>

                <button
                  onClick={() => navigate("/shop/listing")}
                  className="mt-3 w-full bg-white/80 backdrop-blur-md border border-white text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <FiArrowLeft size={18} /> Continue Shopping
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;