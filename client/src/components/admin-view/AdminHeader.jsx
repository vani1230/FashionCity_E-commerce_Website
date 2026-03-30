import { LogoutUser } from "@/store/auth-slice";
import { Menu, UserCircle, LogOut, Store } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminHeader = ({ setSidebarOpen }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(LogoutUser()).then((data) => {
      console.log("Response:", data);
  
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message || "Something went wrong ❌");
      }
    });
  }
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 relative">

      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-purple-700">
        Admin Panel
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-4 relative">

        {/* Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <UserCircle className="text-purple-600" size={26} />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
        </div>

        {/* Dropdown Menu */}
        {openMenu && (
          <div className="absolute right-0 top-14 w-52 bg-white border border-purple-100 rounded-xl shadow-lg p-2">

            {/* Profile */}
            <button
              onClick={() => {
                navigate("/admin/profile");
                setOpenMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-[#F1EEFF]"
            >
              <UserCircle size={18} />
              Admin Profile
            </button>

            {/* Store Management */}
            <button
              onClick={() => {
                navigate("/admin/store");
                setOpenMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-[#F1EEFF]"
            >
              <Store size={18} />
              Manage Store
            </button>

            <hr className="my-2 border-purple-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;