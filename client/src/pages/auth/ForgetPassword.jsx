import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgetPassword`,
        { email },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success(res.data.message);

      // store email for OTP page
      localStorage.setItem("resetEmail", email);

      // navigate after OTP sent
      navigate("/auth/verifyotp");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Locked height and hidden overflow to perfectly match Login/Register and prevent scrollbars
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 px-4 relative overflow-hidden font-sans selection:bg-pink-300 selection:text-white">
      
      {/* Decorative Background Orbs for the premium vibrant feel */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Glassmorphism Card Container */}
      <div className="bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-purple-200/50 rounded-[2rem] p-6 sm:p-10 w-full max-w-md relative z-10 transition-all text-center">
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 tracking-tight">
          Fashion City
        </h2>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </h3>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
          No worries! Enter the email address associated with your account and we'll send you an OTP to reset it.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email Input */}
          <div className="relative group text-left">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/50 border border-white/80 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex justify-center items-center gap-2
            ${
              email
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95"
                : "bg-white/40 text-gray-400 border border-white/50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Sending OTP...</span>
            ) : (
              "Send OTP"
            )}
          </button>

        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Remember your password?
          <Link
            to="/auth/login"
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-bold ml-1.5 hover:underline decoration-purple-500 underline-offset-4"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;