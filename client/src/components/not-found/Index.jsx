import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";

const Index = () => {
  const navigate = useNavigate();

  return (
    // Locked height to viewport with the signature vibrant pastel gradient
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 px-4 relative overflow-hidden font-sans selection:bg-pink-300 selection:text-white">
      
      {/* Decorative Background Orbs for that premium floating feel */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Glassmorphism Card Container */}
      <div className="bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-purple-200/50 rounded-[2.5rem] p-8 sm:p-12 max-w-lg w-full text-center relative z-10 transform transition-all hover:scale-[1.01] duration-500">

        {/* Animated Icon Container */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-pink-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="bg-white/80 p-4 rounded-full shadow-inner border border-white relative z-10">
            <FiAlertTriangle className="text-pink-500 text-5xl sm:text-6xl drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* 404 Title with Gradient Text */}
        <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2 tracking-tight">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-base sm:text-lg mb-10 leading-relaxed px-2">
          Oops! It looks like you've wandered off the fashion runway. The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Go Back Button (Triggers navigate(-1)) */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            <FiArrowLeft size={18} />
            Go Back
          </button>

          {/* Fallback Home Button */}
          <button
            onClick={() => navigate("/home")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-white hover:bg-white text-gray-700 px-8 py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            <FiHome size={18} className="text-purple-500" />
            Home
          </button>

        </div>

      </div>

    </div>
  );
};

export default Index;