import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../../store/auth-slice/index.js";
import { toast } from "sonner";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    dispatch(RegisterUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Registration Successful");
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message || "Something went wrong ❌");
      }
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData(initialState);
    }, 1000);
  };

  return (
    // 🌟 'fixed inset-0' strictly locks the screen to the device viewport. NO SCROLLING ALLOWED. 🌟
    <div className="fixed inset-0 w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 px-4 overflow-hidden font-sans selection:bg-purple-300 selection:text-white">
      
      {/* Decorative Background Orbs (Z-index 0) */}
      <div className="absolute top-[-10%] left-[-10%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-teal-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000 z-0"></div>
      
      {/* Glassmorphism Card - Tightened padding (p-5 sm:p-8) for mobile fit */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-purple-200/40 rounded-[2rem] p-5 sm:p-8 w-full max-w-[400px] relative z-10">
        
        {/* Header - Tightened margins */}
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-0.5 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">Fashion City</span>
          </p>
        </div>

        {/* Form - Tightened gap (gap-3) */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
               <FiUser size={18} />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full bg-white/60 border border-white/80 pl-11 pr-4 py-2.5 sm:py-3 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
               <FiMail size={18} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full bg-white/60 border border-white/80 pl-11 pr-4 py-2.5 sm:py-3 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
               <FiLock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full bg-white/60 border border-white/80 pl-11 pr-12 py-2.5 sm:py-3 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-sm"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-2.5 sm:py-3 rounded-[1rem] font-bold shadow-lg transition-all duration-300 mt-1 flex justify-center items-center gap-2 text-sm sm:text-base
            ${isFormValid ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-pink-300/50 hover:-translate-y-0.5 active:scale-95" : "bg-white/40 text-gray-400 border border-white/50 cursor-not-allowed"}`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Creating...</span>
              </div>
            ) : "Create Account"}
          </button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-5 font-medium">
          Already have an account?
          <Link to="/auth/login" className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-extrabold ml-1.5 hover:underline decoration-purple-400 underline-offset-4 transition-all">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;