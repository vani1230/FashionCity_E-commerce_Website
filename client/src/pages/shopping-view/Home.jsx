import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import About from "@/components/shopping-view/About.jsx";
import HomePageNavbar from "@/components/auth/HomePageNavbar";
import { FiArrowRight, FiTag, FiStar, FiGrid } from "react-icons/fi"; // Added React Icons

const categories = [
  { name: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80" },
  { name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" },
  { name: "Kids", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&q=80" },
  { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80" },
];

const brands = [
  { name: "Nike", image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { name: "Adidas", image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { name: "Puma", image: "https://up.yimg.com/ib/th/id/OIP.0z2kSI_ehJizOeLLUL77dQHaEK?pid=Api&rs=1&c=1&qlt=95&w=193&h=108" },
  { name: "Zara", image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { name: "H&M", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { name: "Levi's", image: "https://up.yimg.com/ib/th/id/OIP.rHlVN6DY-_GKwymdltsmCQHaEK?pid=Api&rs=1&c=1&qlt=95&w=203&h=114" },
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/products/getting");
        if (res.data.success) {
          setFeaturedProducts(res.data.products.slice(0, 4));
        }
      } catch (err) {
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HomePageNavbar />
      
      {/* Added pt-24 to offset the fixed navbar */}
      <div className="flex-1 bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 relative pt-24 pb-12 overflow-hidden">
        
        {/* Background Floating Orbs */}
        <div className="fixed top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-teal-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 space-y-16">
          
          {/* HERO BANNER */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] sm:rounded-[3rem] p-8 md:p-16 text-center shadow-2xl shadow-purple-200/40">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 tracking-tight">
              Elevate Your Style
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Discover the latest trends in fashion, footwear, and accessories. Curated collections just for you.
            </p>
            <button 
              onClick={() => navigate("/shop/listing")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 md:px-10 rounded-full shadow-lg hover:shadow-pink-400/50 hover:-translate-y-1 transition-all text-lg"
            >
              Shop the Full Catalog
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* SHOP BY CATEGORY */}
          <section>
            <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
              <FiGrid className="text-3xl text-purple-500" />
              <h2 className="text-3xl font-extrabold text-gray-800">Shop by Category</h2>
            </div>
            {/* Adjusted grid for better mobile/tablet scaling */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <div 
                  key={cat.name}
                  onClick={() => navigate(`/shop/listing?category=${cat.name}`)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-lg border-2 border-white relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90"></div>
                    <h3 className="absolute bottom-5 left-0 right-0 text-center text-white font-bold text-xl tracking-wide drop-shadow-lg">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SHOP BY BRAND */}
          <section>
            <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
              <FiTag className="text-3xl text-teal-500" />
              <h2 className="text-3xl font-extrabold text-gray-800">Popular Brands</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
              {brands.map((brand) => (
                <div 
                  key={brand.name}
                  onClick={() => navigate(`/shop/listing?brand=${brand.name}`)}
                  className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-200/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:-translate-y-2 group p-4 aspect-square"
                >
                  <img 
                    src={brand.image} 
                    alt={`${brand.name} logo`} 
                    className="w-12 sm:w-16 h-12 sm:h-16 object-contain mb-2 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-gray-800 transition-colors">{brand.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div className="flex items-center gap-3 justify-center sm:justify-start w-full sm:w-auto">
                <FiStar className="text-3xl text-pink-500" />
                <h2 className="text-3xl font-extrabold text-gray-800">Featured Arrivals</h2>
              </div>
              <button onClick={() => navigate("/shop/listing")} className="text-pink-500 font-bold hover:underline hidden sm:flex items-center gap-1">
                View All <FiArrowRight />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center h-40 items-center text-pink-500 font-bold animate-pulse">Loading featured styles...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product._id} onClick={() => navigate(`/shop/listing?search=${product.title}`)} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[1.5rem] p-4 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 relative">
                      <img src={product.image.replace("/upload/", "/upload/w_400,q_auto,f_auto/")} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {product.salePrice > 0 && (
                        <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">SALE</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-extrabold text-lg">
                        ₹{product.salePrice > 0 ? product.salePrice : product.price}
                      </p>
                      {product.salePrice > 0 && (
                        <p className="text-gray-400 line-through text-sm">₹{product.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate("/shop/listing")} className="mt-6 w-full bg-white/80 backdrop-blur-md border border-white text-pink-600 font-bold py-4 rounded-xl shadow-sm sm:hidden flex justify-center items-center gap-2">
              View All Catalog <FiArrowRight />
            </button>
          </section>

          <div className="mt-20 border-t border-purple-200/50 pt-10">
             <About />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;