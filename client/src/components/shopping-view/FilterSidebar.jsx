import React from "react";
import { FiTag, FiStar, FiDollarSign, FiTrash2 } from "react-icons/fi";

const categories = ["Men", "Women", "Kids", "Footwear", "Accessories"];
const brands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levis", "Gucci"];

const FilterSidebar = ({ filters, setFilters }) => {
  const toggleCategory = (cat) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const toggleBrand = (brand) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      price: [0, 10000],
      sort: "",
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* HEADER & CLEAR BUTTON */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/50">
        <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">
          Filters
        </h2>
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiTrash2 /> Clear All
        </button>
      </div>

      {/* CATEGORY */}
      <div>
        <h3 className="flex items-center gap-2 font-bold mb-3 text-gray-700">
          <FiTag className="text-pink-500" /> Category
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 text-sm text-gray-600 font-medium cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400 accent-pink-500 cursor-pointer"
              />
              <span className="group-hover:text-pink-600 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BRAND */}
      <div>
        <h3 className="flex items-center gap-2 font-bold mb-3 text-gray-700">
          <FiTag className="text-purple-500" /> Brand
        </h3>
        <div className="flex flex-col gap-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 text-sm text-gray-600 font-medium cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400 accent-purple-500 cursor-pointer"
              />
              <span className="group-hover:text-purple-600 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div>
        <h3 className="flex items-center gap-2 font-bold mb-3 text-gray-700">
          <FiDollarSign className="text-teal-500" /> Max Price
        </h3>
        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={filters.price[1]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              price: [0, Number(e.target.value)],
            }))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
          <span>₹0</span>
          <span className="text-teal-600 bg-teal-50 px-2 py-1 rounded-md">₹{filters.price[1]}</span>
        </div>
      </div>

      {/* RATING */}
      {/* <div>
        <h3 className="flex items-center gap-2 font-bold mb-3 text-gray-700">
          <FiStar className="text-amber-400" /> Minimum Rating
        </h3>
        <select
          value={filters.rating}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              rating: Number(e.target.value),
            }))
          }
          className="w-full bg-white/60 border border-white rounded-xl p-3 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm cursor-pointer"
        >
          <option value="0">All Ratings</option>
          <option value="4">4 Stars & Above</option>
          <option value="3">3 Stars & Above</option>
          <option value="2">2 Stars & Above</option>
        </select>
      </div> */}
    </div>
  );
};

export default FilterSidebar;