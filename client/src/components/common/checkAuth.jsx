import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, isLoading, children }) => {
  const location = useLocation();

  // 0️⃣ Prevent premature redirects while Redux is still fetching user data
  if (isLoading) {
    return null; // Or return a <Spinner /> / loading text if you prefer
  }

  // 1️⃣ If user NOT logged in and trying to access protected routes
  if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" />;
  }

  // 2️⃣ If user logged in and trying to open login/register page
  if (isAuthenticated && location.pathname.startsWith("/auth")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/home" />;
    }
  }

  // 3️⃣ If logged in but NOT admin and trying to access admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauthPage" />;
  }

  // 4️⃣ If admin trying to access shop pages (Expanded to include all customer routes)
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.startsWith("/shop") ||
     location.pathname === "/home" ||
     location.pathname === "/cart" ||
     location.pathname === "/account" ||
     location.pathname === "/wishlist" ||
     location.pathname === "/checkout")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default CheckAuth;