import { FaShoppingBag, FaTruck, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 relative z-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4 sm:mb-6 tracking-tight">
          About Fashion City
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
          Fashion City is your one-stop destination for trendy and stylish
          fashion. We believe fashion should be affordable, comfortable, and
          accessible to everyone.
        </p>
      </div>

      {/* Features (Glassmorphism Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">

        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-lg shadow-pink-200/30 hover:shadow-xl hover:shadow-pink-300/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
            <FaShoppingBag className="text-3xl text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Latest Fashion</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Discover trending outfits and modern fashion curated specially for
            style lovers.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-lg shadow-purple-200/30 hover:shadow-xl hover:shadow-purple-300/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
            <FaTruck className="text-3xl text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We deliver your favorite styles quickly and safely directly to your doorstep.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-lg shadow-rose-200/30 hover:shadow-xl hover:shadow-rose-300/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
            <FaHeart className="text-3xl text-rose-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Loved by Customers</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Thousands of happy shoppers trust Fashion City for quality, style, and comfort.
          </p>
        </div>

      </div>

      {/* Story Section */}
      <div className="max-w-5xl mx-auto mt-16 sm:mt-24 bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-purple-200/40 p-8 sm:p-14 text-center sm:text-left relative overflow-hidden">
        {/* Subtle inner orb just for the story section */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 relative z-10">
          Our Story
        </h2>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium relative z-10">
          Fashion City was created with a vision to bring trendy and affordable
          fashion to everyone. From everyday casual outfits to elegant styles,
          we carefully select products that combine comfort with fashion.
          Our mission is to help you express your vibrant personality through style.
        </p>
      </div>
    </div>
  );
};

export default About;