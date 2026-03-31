import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast } from "sonner";
import { FiChevronRight, FiX, FiLock, FiMail } from "react-icons/fi";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/updatepassword`,
        { email: user?.email, password: newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated");
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div 
            onClick={() => {
              setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              setShowPasswordForm(true);
            }}
            className="bg-white/50 backdrop-blur-md border border-white rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                <FiLock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Change Password</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Update your account security credentials</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 group-hover:text-purple-500 transition-colors" size={24} />
          </div>
          
          <div className="bg-white/50 backdrop-blur-md border border-white rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 text-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                <FiMail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Notification Preferences</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Manage emails, SMS, and promotional alerts</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 group-hover:text-pink-500 transition-colors" size={24} />
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-8 relative">
            <button onClick={() => setShowPasswordForm(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 shadow-sm">
              <FiX size={18} />
            </button>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="w-full bg-white/60 border border-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="••••••••" className="w-full bg-white/60 border border-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full bg-white/60 border border-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-purple-300/50 hover:-translate-y-1 active:scale-95 transition-all mt-4">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;