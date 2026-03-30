import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiUser } from "react-icons/fi";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 px-4 py-12 relative overflow-hidden font-sans selection:bg-pink-300 selection:text-white">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] animate-blob z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-teal-200/60 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] animate-blob animation-delay-2000 z-0"></div>

      {/* Glassmorphism Card */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-purple-200/50 rounded-[2rem] p-8 sm:p-12 w-full max-w-lg relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Animated Success Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-70"></div>
          <div className="relative bg-emerald-100 text-emerald-500 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">
            <FiCheckCircle size={48} className="animate-in zoom-in duration-500 delay-200" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 font-medium text-base sm:text-lg mb-10 leading-relaxed">
          Thank you for shopping with us! Your beautiful new styles are being prepared and will be on their way to you soon.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button 
            onClick={() => navigate('/account')} 
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-purple-100 text-purple-600 font-bold py-3.5 px-6 rounded-xl shadow-sm hover:bg-purple-50 hover:border-purple-200 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
          >
            <FiUser size={18} /> My Account
          </button>
          
          <button 
            onClick={() => navigate('/shop/listing')} 
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-0.5 active:scale-95 transition-all text-sm sm:text-base"
          >
            <FiShoppingBag size={18} /> Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default Confirmation;