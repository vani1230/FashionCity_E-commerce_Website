import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  FiMapPin, 
  FiCreditCard, 
  FiDollarSign, 
  FiSmartphone, 
  FiCheckCircle, 
  FiArrowRight, 
  FiShoppingBag,
  FiShield,
  FiArrowLeft
} from "react-icons/fi";
import { fetchAddressThunk } from "../../store/address-slice/Index.js";
import {
  createCODOrderThunk,
  verifyPaymentThunk,
} from '../../store/order-slice/Index.js';
import { PiCurrencyInr } from "react-icons/pi";
import { clearCartAsync } from '../../store/cart-slice/index.js';

const paymentMethods = [
  { id: "card", title: "Credit / Debit Card", icon: <FiCreditCard size={20} className="sm:w-6 sm:h-6" />, desc: "Pay securely with your bank" },
  { id: "upi", title: "UPI / QR", icon: <FiSmartphone size={20} className="sm:w-6 sm:h-6" />, desc: "Google Pay, PhonePe, Paytm" },
  { id: "cod", title: "Cash on Delivery", icon: <PiCurrencyInr size={20} className="sm:w-6 sm:h-6" />, desc: "Pay when your order arrives" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux States
  const { user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.address);
  const cartItems = useSelector((state) => state.cart.items) || [];

  // Local States
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAddressThunk(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr._id);
    }
  }, [addresses]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity, 
    0
  );
  const shippingFee = cartTotal > 5000 ? 0 : 99; 
  const finalTotal = cartTotal + shippingFee;



  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      if (!selectedAddress) {
        toast.error("Select address");
        return;
      }

      const selectedAddr = addresses.find(
        (a) => a._id === selectedAddress
      );

      // 🟡 COD FLOW
      if (selectedPayment === "cod") {
        const res = await dispatch(
          createCODOrderThunk({
            cartItems,
            address: selectedAddr,
            totalAmount: finalTotal,
            userId: user._id,
          })
        );
        if (res.payload?.success) {
          toast.success("Order placed 🎉");
          // 🔥 clear cart
          dispatch(clearCartAsync());

          navigate("/shop/confirmation");
        } else {
          toast.error(res.payload?.message || "Order failed");
        }
        return;
      }

      // 🟢 ONLINE PAYMENT
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: finalTotal },
        { withCredentials: true } // ✅ important
      );
      const order = data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Fashion City",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          const res = await dispatch(
            verifyPaymentThunk({
              ...response,
              cartItems,
              address: selectedAddr,
              totalAmount: finalTotal,
              userId: user._id,
              paymentMethod: selectedPayment,
            })
          );

          if (res.payload?.success) {
            toast.success("Payment Successful 🎉");

            // 🔥 clear cart
            dispatch(clearCartAsync());

            navigate("/shop/confirmation");
          } else {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled ❌");
          },
        },

        prefill: {
          name: user?.name,
        },

        theme: {
          color: "#ec4899",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-10 text-center shadow-xl max-w-md w-full mx-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-pink-500 shadow-inner">
            <FiShoppingBag className="text-4xl sm:text-5xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">Checkout is Empty</h2>
          <p className="text-sm sm:text-lg text-gray-500 mb-6 sm:mb-8 font-medium">Add some stylish items to your cart before proceeding.</p>
          <button onClick={() => navigate('/shop/listing')} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-base sm:text-lg font-bold py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-pink-300 hover:-translate-y-1 transition-all">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden selection:bg-pink-300 selection:text-white">
      {/* Background Blobs */}
      <div className="fixed top-[-5%] right-[-5%] w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[120px] opacity-60 animate-blob pointer-events-none z-0"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-teal-200 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[120px] opacity-60 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-gray-600 font-medium mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base">
              <FiShield className="text-emerald-500 shrink-0" size={16} /> SSL Encrypted & 100% Secure Transaction
            </p>
          </div>
          <button onClick={() => navigate('/shop/listing')} className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white text-gray-700 font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-xl shadow-sm hover:shadow-md hover:bg-white hover:text-pink-500 hover:-translate-y-0.5 transition-all text-sm sm:text-base w-full sm:w-auto justify-center">
            <FiArrowLeft className="text-base sm:text-lg" /> Back to Shop
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT COLUMN: Address & Payment */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            
            {/* 1. DELIVERY ADDRESS */}
            <section className="bg-white/70 backdrop-blur-2xl border border-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-purple-200/40 p-5 sm:p-8 lg:p-10">
              <div className="flex justify-between items-center mb-5 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-4">
                  <span className="bg-gradient-to-br from-pink-400 to-purple-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg shadow-md shrink-0">1</span>
                  Delivery Address
                </h2>
                <button onClick={() => navigate('/account')} className="text-xs sm:text-sm font-bold bg-pink-50 text-pink-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-pink-100 hover:text-purple-600 transition-colors whitespace-nowrap">
                  + Add New
                </button>
              </div>

              {addresses?.length === 0 ? (
                 <div className="bg-white/50 border border-pink-100 rounded-[1rem] sm:rounded-2xl p-6 sm:p-10 text-center shadow-sm">
                    <p className="text-gray-600 font-medium text-sm sm:text-lg mb-4 sm:mb-6">You don't have any saved addresses yet.</p>
                    <button onClick={() => navigate('/account')} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-md hover:-translate-y-1 transition-all text-sm sm:text-base">Go to Account</button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {addresses?.map((addr) => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr._id)}
                      className={`relative p-4 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 ${
                        selectedAddress === addr._id 
                          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500 shadow-md transform scale-[1.01]" 
                          : "bg-white border-white/80 shadow-sm hover:border-purple-200 hover:shadow-md"
                      }`}
                    >
                      {selectedAddress === addr._id && (
                        <div className="absolute top-4 right-4 text-purple-500 animate-in zoom-in duration-200">
                          <FiCheckCircle className="fill-purple-100 text-[20px] sm:text-[24px]" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className={`p-1.5 sm:p-2 rounded-full ${selectedAddress === addr._id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                           <FiMapPin className="text-[14px] sm:text-[18px]" />
                        </div>
                        <span className="font-extrabold text-gray-800 tracking-wide uppercase text-xs sm:text-sm line-clamp-1 pr-6">{addr.notes?.split("|")[0]?.trim() || "Home"}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">{user?.name}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-1 font-medium line-clamp-2">{addr.address}, {addr.city}</p>
                      <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 font-medium">{addr.pincode}</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-700 bg-gray-50 py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg inline-block border border-gray-100">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. PAYMENT METHOD */}
            <section className="bg-white/70 backdrop-blur-2xl border border-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-purple-200/40 p-5 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-4 mb-5 sm:mb-8">
                <span className="bg-gradient-to-br from-pink-400 to-purple-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg shadow-md shrink-0">2</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex items-center p-3 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 shadow-sm ${
                      selectedPayment === method.id 
                        ? "bg-gradient-to-br from-pink-50 to-orange-50 border-pink-500 shadow-md transform scale-[1.01]" 
                        : "bg-white border-white/80 hover:border-pink-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-3 sm:gap-5">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shadow-sm shrink-0 ${selectedPayment === method.id ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {method.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm sm:text-lg leading-tight ${selectedPayment === method.id ? "text-gray-900" : "text-gray-700"}`}>{method.title}</h3>
                        <p className="text-[10px] sm:text-sm text-gray-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">{method.desc}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ml-2 shrink-0 bg-white">
                      {selectedPayment === method.id ? (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-500 rounded-full animate-in zoom-in"></div>
                      ) : (
                        <div className="w-full h-full border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-purple-200/50 p-5 sm:p-8 sticky top-20 sm:top-28">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                 <FiShoppingBag className="text-pink-500 shrink-0" /> Order Summary
              </h2>
              
              {/* Items List */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-[250px] sm:max-h-[350px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                {cartItems.map((item) => (
                  <div key={item.productId || item._id} className="flex gap-3 sm:gap-4 items-center bg-white border border-gray-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.title} className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow-sm border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 sm:line-clamp-2 leading-tight mb-1">{item.title}</h4>
                      <p className="text-[10px] sm:text-sm text-gray-500 font-medium bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded-md w-fit">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-gray-900 text-sm sm:text-lg">₹{(item.salePrice > 0 ? item.salePrice : item.price) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200/60 my-4 sm:my-6"></div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 font-medium text-sm sm:text-lg">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-sm sm:text-lg items-center">
                  <span>Shipping Fee</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm flex items-center gap-1">
                       <FiCheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Free
                    </span>
                  ) : (
                    <span className="text-gray-800 font-bold">₹{shippingFee}</span>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-200/60 my-4 sm:my-6"></div>

              {/* Total */}
              <div className="flex justify-between items-end mb-6 sm:mb-8 bg-gradient-to-r from-pink-50 to-purple-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white">
                <span className="text-gray-700 font-extrabold text-lg sm:text-xl">Total</span>
                <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  ₹{finalTotal}
                </span>
              </div>

              {/* Place Order Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 sm:gap-3 text-white font-bold py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl shadow-xl transition-all text-base sm:text-xl
                  ${isProcessing 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-pink-400/50 hover:-translate-y-1 hover:scale-[1.01] active:scale-95 bg-[length:200%_auto] hover:bg-right"
                  }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 sm:w-7 sm:h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Complete Purchase <FiArrowRight className="text-lg sm:text-2xl" />
                  </>
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 font-medium flex items-center justify-center gap-1.5 sm:gap-2">
                <FiShield className="text-emerald-500 shrink-0" size={14} /> Payments are secure and encrypted
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;