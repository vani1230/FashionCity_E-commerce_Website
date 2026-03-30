import React from "react";
import { Outlet } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const HeroHeader = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-pink-100 via-purple-100 to-emerald-100">

      {/* HERO SECTION */}
      <div className="hidden lg:flex flex-col justify-center items-center px-16 text-center">

        <div className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-6">
          <FiShoppingBag />
          Fashion City
        </div>

        <h1 className="text-5xl font-bold text-gray-700 mb-4">
          Elevate Your <span className="text-pink-500">Style</span>
        </h1>

        <p className="text-gray-600 max-w-md mb-8">
          "Fashion is the armor to survive the reality of everyday life."
        </p>

        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
          alt="fashion"
          className="rounded-2xl shadow-xl w-[380px] object-cover"
        />

      </div>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-md">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default HeroHeader;