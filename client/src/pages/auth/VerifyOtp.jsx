import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verifyotp", {
        email,
        otp,
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/auth/updatepassword", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    // Locked height and hidden overflow to prevent scrollbars
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 px-4 relative overflow-hidden font-sans selection:bg-pink-300 selection:text-white">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Glassmorphism Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-purple-200/50 rounded-[2rem] p-6 sm:p-10 w-full max-w-md relative z-10 transition-all text-center">
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 tracking-tight">
          Verify OTP
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
          We've sent a one-time password to your email. Please enter it below to verify your identity.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          
          <div className="relative group text-left">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full bg-white/50 border border-white/80 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:bg-white transition-all shadow-sm placeholder-gray-400 text-gray-700 font-medium text-center tracking-widest text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            OTP expires in: <span className={`font-bold ${timeLeft < 10 ? 'text-pink-500 animate-pulse' : 'text-teal-500'}`}>{timeLeft}s</span>
          </p>

          <button
            disabled={timeLeft === 0 || !otp}
            className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex justify-center items-center gap-2
            ${
              timeLeft > 0 && otp
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95"
                : "bg-white/40 text-gray-400 border border-white/50 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>
        </form>

      </div>
    </div>
  );
};

export default VerifyOtp;