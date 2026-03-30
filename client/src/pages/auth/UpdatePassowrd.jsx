import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/updatepassword",
        {
          email,
          password: formData.password
        }
      );
      console.log(res.data);
      toast.success(res.data.message);

      localStorage.removeItem("resetEmail");
      navigate("/auth/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Locked height and hidden overflow to prevent scrollbars
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 px-4 relative overflow-hidden font-sans selection:bg-purple-300 selection:text-white">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Glassmorphism Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-purple-200/50 rounded-[2rem] p-6 sm:p-10 w-full max-w-md relative z-10 transition-all text-center">
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 tracking-tight">
          Fashion City
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
          Secure your account by creating a new, strong password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">

          {/* New Password */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/50 border border-white/80 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={22}/> : <FiEye size={22}/>}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/50 border border-white/80 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors p-1"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEyeOff size={22}/> : <FiEye size={22}/>}
            </button>
          </div>

          {/* Submit */}
          <button
            disabled={loading || !formData.password || !formData.confirmPassword}
            className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 mt-2 flex justify-center items-center gap-2
            ${
              formData.password && formData.confirmPassword
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95"
                : "bg-white/40 text-gray-400 border border-white/50 cursor-not-allowed"
            }`}
          >
            {loading ? <span className="animate-pulse">Updating...</span> : "Update Password"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Back to
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

export default UpdatePassword;