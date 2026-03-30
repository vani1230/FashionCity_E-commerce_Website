import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiX, FiFilter, FiCheck, FiSliders, FiArrowLeft } from "react-icons/fi";
import FilterSidebar from "../../components/shopping-view/FilterSidebar.jsx";
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlistAsync, removeFromWishlistAsync } from "../../store/wishlist-slice";
import { addToCartAsync } from "../../store/cart-slice";

const Listing = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // <-- Added navigation hook
  
  // Controls the mobile filter drawer
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products/getting");
      if (res.data.success) {
        setProducts(res.data.products);
        setAllProducts(res.data.products);
      }
    } catch (err) {
      toast.error("Error Fetching Products",err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* FILTER STATE */
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    price: [0, 10000],
    rating: 0,
    sort: "",
  });

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const searchParam = searchParams.get("search");

  const [search, setSearch] = useState(searchParam || "");

  useEffect(() => {
    if (categoryParam && categoryParam !== "All") {
      setFilters(prev => ({ ...prev, categories: [categoryParam] }));
    }
    if (brandParam) {
      setFilters(prev => ({ ...prev, brands: [brandParam] }));
    }
  }, [categoryParam, brandParam]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (search) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (filters.categories.length) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands.length) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }
    filtered = filtered.filter((p) => p.salePrice >= filters.price[0] && p.salePrice <= filters.price[1]);
    
    if (filters.sort === "low-high") {
      filtered.sort((a, b) => a.salePrice - b.salePrice);
    }
    if (filters.sort === "high-low") {
      filtered.sort((a, b) => b.salePrice - a.salePrice);
    }

    setProducts(filtered);
  }, [search, filters, allProducts]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  
  const handleWishlistToggle = (product, e) => {
    e.stopPropagation(); 
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (exists) {
      dispatch(removeFromWishlistAsync(product._id)); toast.success("Removed from wishlist ❌");
    } else {
      dispatch(addToWishlistAsync(product)); toast.success("Added to wishlist 💖");
    }
  };

  const handleAddToCart = (product, e) => {
    if(e) e.stopPropagation(); 
    
    if (product.totalStock === 0) {
      toast.error("This item is out of stock!");
      return;
    }

    setSelectedProduct(product);
    dispatch(addToCartAsync(product));
    toast.success("Added to cart 🛒");
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 relative pt-6 pb-12 overflow-hidden">
      
      {/* Background Floating Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      <div className="max-w-[1500px] mx-auto px-3 sm:px-6 relative z-10">
        
        {/* BACK TO HOME NAVIGATION BUTTON */}
        <div className="mb-4 sm:mb-6 max-w-3xl mx-auto flex">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 bg-white/70 hover:bg-white backdrop-blur-xl px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <FiArrowLeft size={16} /> Back to Home
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-10 relative group flex items-center">
          <div className="absolute left-3 sm:left-4 z-10 bg-gradient-to-br from-pink-100 to-purple-100 p-2 sm:p-2.5 rounded-xl text-pink-500 group-focus-within:text-purple-600 shadow-inner transition-colors">
            <FiSearch className="text-lg sm:text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search products, brands, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 sm:pl-16 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white text-gray-800 shadow-lg shadow-purple-200/30 focus:bg-white focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none transition-all placeholder-gray-400 font-semibold text-sm sm:text-base relative z-0"
          />
        </div>

        {/* TWO-PART MOBILE TOOLBAR (Sort & Filter) */}
        <div className="lg:hidden flex items-center bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-lg shadow-purple-200/30 mb-6 overflow-hidden">
          
          {/* Part 1: SORT */}
          <div className="flex-1 relative flex items-center justify-center border-r border-gray-200/50 hover:bg-gray-50 transition-colors">
            <FiSliders className="absolute left-4 sm:left-8 text-gray-500 pointer-events-none" size={16} />
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full bg-transparent text-gray-700 font-bold text-sm py-3.5 pl-10 pr-2 sm:px-4 outline-none appearance-none cursor-pointer text-center"
            >
              <option value="">Sort By</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Part 2: FILTER BUTTON */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 text-purple-600 font-bold text-sm py-3.5 hover:bg-purple-50 transition-colors relative"
          >
            <FiFilter size={16} /> Filters
            {(filters.categories.length > 0 || filters.brands.length > 0) && (
              <span className="absolute top-2.5 right-6 sm:right-10 w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-sm"></span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-xl shadow-purple-200/40 p-5 sm:p-6 transition-all">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* MOBILE FILTER DRAWER */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-[100] flex lg:hidden">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={() => setShowMobileFilters(false)}
              ></div>
              
              <div className="relative w-4/5 max-w-sm h-full bg-gradient-to-b from-white to-pink-50/50 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Filters</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                  <FilterSidebar filters={filters} setFilters={setFilters} />
                </div>

                <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                   <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-pink-300/50 active:scale-95 transition-all"
                  >
                    <FiCheck size={18} /> Show {products.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS CATALOG */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-pink-500 font-bold text-xl animate-pulse">Loading Catalog...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-10 text-center shadow-lg">
                    <p className="text-gray-500 font-medium text-lg">No products found 🥲</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product._id} onClick={() => setSelectedProduct(product)} className="bg-white/60 backdrop-blur-xl border border-white rounded-[1.25rem] sm:rounded-2xl shadow-lg shadow-purple-200/30 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group cursor-pointer flex flex-col relative">
                      
                      {/* Image & Badges */}
                      <div className="relative w-full h-40 sm:h-52 md:h-60 bg-gray-50 overflow-hidden">
                        {product.salePrice > 0 && <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10 shadow-sm">SALE</span>}
                        
                        <button onClick={(e) => handleWishlistToggle(product, e)} className="absolute top-2 right-2 bg-white/80 p-1.5 sm:p-2 rounded-full z-10 shadow-sm hover:scale-110 active:scale-95 transition-transform">
                          {wishlistItems.some((item) => item._id === product._id) ? <FaHeart className="text-red-500 text-sm sm:text-base" /> : <FaRegHeart className="text-gray-500 text-sm sm:text-base" />}
                        </button>
                        
                        <img src={product.image.replace("/upload/", "/upload/w_400,q_auto,f_auto/")} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>

                      {/* Details & Low Stock Tag */}
                      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-xs sm:text-base text-gray-800 line-clamp-2">{product.title}</h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">{product.category} • {product.brand}</p>
                        
                        {/* LOW STOCK INDICATOR */}
                        {product.totalStock === 0 ? (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mt-1.5 w-fit">Out of Stock</span>
                        ) : product.totalStock < 10 ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1.5 w-fit">Only {product.totalStock} left!</span>
                        ) : null}

                        <div className="mt-auto pt-3 flex sm:justify-between sm:items-end gap-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm sm:text-lg">
                            ₹{product.salePrice > 0 ? product.salePrice : product.price}
                          </span>
                          
                          <button 
                            onClick={(e) => handleAddToCart(product, e)} 
                            disabled={product.totalStock === 0}
                            className={`hidden sm:flex p-2 rounded-lg transition-colors active:scale-95 ${
                              product.totalStock === 0 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-purple-50 hover:bg-purple-500 text-purple-500 hover:text-white"
                            }`}
                          >
                            <FiShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL POPUP */}
      {selectedProduct && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
            <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 md:p-8 relative animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 shadow-sm">
              <FiX size={18} />
            </button>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
              
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner h-64 md:h-[24rem]">
                <img src={selectedProduct.image.replace("/upload/", "/upload/w_600,q_auto,f_auto/")} alt={selectedProduct.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight leading-tight">{selectedProduct.title}</h2>
                <p className="text-purple-500 font-semibold text-sm mt-2">{selectedProduct.category} • {selectedProduct.brand}</p>

                <div className="mt-4 flex items-center gap-3 bg-pink-50/50 p-3 rounded-xl border border-pink-100 w-fit">
                  {selectedProduct.salePrice > 0 ? (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-3xl">₹{selectedProduct.salePrice}</span>
                      <span className="line-through text-gray-400 font-medium text-lg">₹{selectedProduct.price}</span>
                    </>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-3xl">₹{selectedProduct.price}</span>
                  )}
                </div>

                <p className="mt-5 text-gray-600 leading-relaxed font-medium">{selectedProduct.description || "Premium quality product crafted with attention to detail and modern aesthetics."}</p>
                
                {/* MODAL LOW STOCK INDICATOR */}
                {selectedProduct.totalStock === 0 ? (
                  <p className="text-sm font-semibold text-red-600 mt-4 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg w-fit shadow-sm">
                    Out of Stock
                  </p>
                ) : selectedProduct.totalStock < 10 ? (
                  <p className="text-sm font-semibold text-amber-600 mt-4 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg w-fit shadow-sm">
                    Hurry! Only {selectedProduct.totalStock} left in stock
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-teal-600 mt-4 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg w-fit shadow-sm">
                    In Stock: {selectedProduct.totalStock} units
                  </p>
                )}
                
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={(e) => handleAddToCart(selectedProduct, e)} 
                    disabled={selectedProduct.totalStock === 0}
                    className={`flex-1 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                      selectedProduct.totalStock === 0 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none" 
                        : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95"
                    }`}
                  >
                    <FiShoppingCart size={18} /> {selectedProduct.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button onClick={(e) => handleWishlistToggle(selectedProduct, e)} className="bg-white border-2 border-pink-200 text-pink-500 hover:bg-pink-50 w-14 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95">
                     {wishlistItems.some((item) => item._id === selectedProduct._id) ? <FaHeart size={20} className="text-red-500" /> : <FaRegHeart size={20} />}
                  </button>
                </div>

              </div>
            </div>
          </div>
         </div>
      )}
    </div>
  );
};

export default Listing;