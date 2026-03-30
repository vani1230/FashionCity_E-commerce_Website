import React from "react";
import { Link } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-emerald-100 px-4">

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="flex justify-center text-pink-500 text-5xl mb-4">
          <FiLock />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          Access Restricted
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          This page is currently not accessible for you.  
          Only administrators can view this section.
        </p>

        {/* Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <FiArrowLeft />
          Back to Home
        </Link>

      </div>

    </div>
  );
};

export default Index;
