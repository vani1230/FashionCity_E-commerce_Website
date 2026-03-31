import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { LoginUser } from "@/store/auth-slice";
import { fetchCart } from "@/store/cart-slice";
import { fetchWishlist } from "@/store/wishlist-slice";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.email.trim() !== "" && formData.password.trim() !== "";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    dispatch(LoginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Login Successful");
        navigate("/home");
      } else {
        toast.error(data?.payload?.message || "Something went wrong ❌");
        setFormData(initialState);
      }
    });
    
    dispatch(fetchCart());
    dispatch(fetchWishlist());
    
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    // 🌟 'fixed inset-0 flex' locks the entire page to the screen. NO SCROLLING.
    <div className="fixed inset-0 flex w-full font-sans selection:bg-pink-300 selection:text-white bg-white">
      
      {/* ================= LEFT COLUMN: IMAGE ================= */}
      {/* Hides on mobile, takes 50% width on large screens */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" 
          alt="Fashion City Collection" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Image Text Overlay */}
        <div className="absolute bottom-16 left-12 text-white pr-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl xl:text-5xl font-extrabold mb-4 tracking-tight">
            Welcome Back to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Your Style.</span>
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            Log in to pick up right where you left off. Discover new arrivals, manage your wishlist, and check out seamlessly.
          </p>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 relative px-4 sm:px-8 overflow-hidden">
        
        {/* Decorative Background Orbs (Z-index 0) */}
        <div className="absolute top-[-10%] left-[-10%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob z-0"></div>
        <div className="absolute top-[20%] right-[-10%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-teal-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 z-0"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000 z-0"></div>
        
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-purple-200/40 rounded-[2rem] p-6 sm:p-10 w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Login to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">Fashion City</span>
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                 <FiMail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full bg-white/60 border border-white/80 pl-11 pr-4 py-3 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-sm sm:text-base"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                 <FiLock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full bg-white/60 border border-white/80 pl-11 pr-12 py-3 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-sm sm:text-base"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-[-4px]">
              <Link to="/auth/forgetPassword" className="text-xs font-bold text-purple-500 hover:text-pink-500 transition-colors bg-transparent">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 rounded-[1rem] font-bold shadow-lg transition-all duration-300 mt-2 flex justify-center items-center gap-2 text-sm sm:text-base
              ${isFormValid ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-pink-300/50 hover:-translate-y-0.5 active:scale-95" : "bg-white/40 text-gray-400 border border-white/50 cursor-not-allowed"}`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Logging in...</span>
                </div>
              ) : "Login"}
            </button>

            <div className="relative flex items-center py-1.5 sm:py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 font-medium">
            Don't have an account?
            <Link to="/auth/register" className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-extrabold ml-1.5 hover:underline decoration-pink-400 underline-offset-4 transition-all">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;