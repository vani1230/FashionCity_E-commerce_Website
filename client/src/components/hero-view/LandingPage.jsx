import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiStar, FiHeart, FiZap } from "react-icons/fi";

// Expanded image list with more vibrant, matching pastel/fashion aesthetics
const images = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", // New Image
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop", // New Image
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"  // New Image
];

const quotes = [
  "Style is a way to say who you are without speaking.",
  "Fashion fades, but style is eternal.",
  "Dress like you're already famous.",
  "Fashion is the confidence you wear before anyone notices."
];

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const slider = setInterval(() => {
      setFade(false); // Trigger fade out for text
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // Trigger fade in for text
      }, 300); // Wait for fade out before changing text
    }, 4500);

    return () => clearInterval(slider);
  }, []);

  return (
    // Boosted vibrancy in the background gradient
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 min-h-screen flex flex-col font-sans selection:bg-pink-300 selection:text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-12 lg:py-20 gap-12 max-w-[1400px] mx-auto w-full">

        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left z-10">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
            Fashion <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">City</span>
          </h1>

          {/* Animated Quote */}
          <p className={`text-lg sm:text-xl text-gray-600 max-w-md mx-auto lg:mx-0 h-16 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {quotes[current]}
          </p>

          {/* Buttons with Hover Lifts & Colored Shadows */}
          <div className="flex gap-4 justify-center lg:justify-start flex-wrap pt-2">
            <Link
              to="/auth/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-300/50 hover:shadow-pink-400/60 hover:-translate-y-1 transition-all duration-300 font-medium"
            >
              Login
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/auth/register"
              className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/80 text-gray-700 px-8 py-3.5 rounded-2xl shadow-sm hover:bg-white hover:shadow-lg hover:shadow-purple-200/50 hover:-translate-y-1 transition-all duration-300 font-medium"
            >
              Register
              <FiShoppingBag className="text-purple-500" />
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE SLIDER - Now fluid and responsive */}
        <div className="flex-1 flex justify-center w-full">
          {/* Changed fixed widths to aspect ratio so it scales perfectly on mobile */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-200/50 group">
            
            {/* Smooth Crossfade Images */}
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Fashion model"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${
                  index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            
            {/* Overlay gradient to make images blend with the pastel theme slightly */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
          </div>
        </div>

      </section>

      {/* FEATURE STRIP - Upgraded to vibrant glassmorphism cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 sm:px-12 lg:px-24 pb-16 max-w-[1400px] mx-auto w-full mt-auto">
        
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-2 transition-all duration-300 text-center group">
          <div className="bg-pink-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FiStar className="text-pink-500 text-xl" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Trendy Styles</h3>
          <p className="text-gray-600 text-sm">
            Discover the latest fashion trends curated just for you.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-2 transition-all duration-300 text-center group">
           <div className="bg-purple-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FiHeart className="text-purple-500 text-xl" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Premium Quality</h3>
          <p className="text-gray-600 text-sm">
            High-quality fashion that blends comfort with elegance.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-teal-200/50 hover:-translate-y-2 transition-all duration-300 text-center sm:col-span-2 md:col-span-1 group">
           <div className="bg-teal-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FiZap className="text-teal-500 text-xl" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Fast Delivery</h3>
          <p className="text-gray-600 text-sm">
            Get your favorite outfits delivered quickly to your door.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/50 py-8 text-center mt-auto">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 inline-block">
          Fashion City
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Dress Bold. Feel Confident. Be You.
        </p>
        <p className="text-gray-400 text-xs mt-3">
          © {new Date().getFullYear()} Fashion City. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;