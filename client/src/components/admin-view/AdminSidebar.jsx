import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Sparkles, X } from "lucide-react";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#DCD6FF] transition";

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#E9E6FF] shadow-lg transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        {/* Top */}
        <div className="flex items-center justify-between p-4 border-b border-purple-200">
          <h2 className="text-xl font-bold text-purple-700">Admin</h2>

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 text-gray-700">

          <NavLink to="/admin/dashboard" className={linkStyle}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={linkStyle}>
            <Package size={18} />
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={linkStyle}>
            <ShoppingCart size={18} />
            Orders
          </NavLink>

        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;