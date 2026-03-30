import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AuthLayout from "./components/auth/ShoppingNavbar.jsx"; 

import AdminLayout from "./components/admin-view/AdminLayout.jsx";
import Dashboard from "./pages/admin-view/Dashboard.jsx";
import Products from "./pages/admin-view/Products.jsx";
import Orders from "./pages/admin-view/Orders.jsx";

import Index from "./components/not-found/index.jsx";

import Home from "./pages/shopping-view/Home.jsx";
import Listing from "./pages/shopping-view/Listing.jsx";
import Checkout from "./pages/shopping-view/Checkout.jsx";
import Account from "./pages/shopping-view/Account.jsx";

import LandingPage from "./components/hero-view/LandingPage.jsx";

import CheckAuth from "./components/common/checkAuth.jsx";
import UnAuth from "./pages/unauth-page/Index.jsx";
import HeroHeader from "./components/hero-view/HeroHeader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, fetchUserFromToken } from "./store/auth-slice/index.js";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import UpdatePassword from "./pages/auth/UpdatePassowrd.jsx";
import Profile from "./pages/admin-view/Profile.jsx";
import About from './components/shopping-view/About.jsx';
import Contact from './components/shopping-view/Contact.jsx';
import Cart from "./pages/shopping-view/Cart.jsx";
import Confirmation from "./pages/shopping-view/Confirmation.jsx";
import Wishlist from "./pages/shopping-view/Wishlist.jsx";
import { fetchCart } from "./store/cart-slice/index.js";
import { fetchWishlist } from "./store/wishlist-slice/index.js";
import { fetchAllOrdersThunk } from "./store/order-slice/Index.js";

const App = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
      dispatch(fetchUserFromToken());
      dispatch(fetchCart());
      dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(fetchAllOrdersThunk());
  },[dispatch])
  return (
    <Routes>
      {/* HERO SECTION */}
      <Route path="/" element={<LandingPage />} />

      {/* AUTH ROUTES */}
      <Route
        path="/auth"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <HeroHeader />
          </CheckAuth>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgetPassword" element={<ForgetPassword/>}/>
        <Route path="verifyotp" element={<VerifyOtp/>}/>
        <Route path="updatepassword" element={<UpdatePassword/>}/>
      </Route>

      {/* ADMIN PANEL */}
      <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 🌟 1. PAGES WITH THE NAVBAR 🌟 */}
      <Route  path="/shop"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <AuthLayout /> {/* This wraps Home and Listing with the Navbar */}
          </CheckAuth> 
        }
      >
        <Route path="listing" element={<Listing />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="confirmation" element={<Confirmation />} />
      </Route>

      {/* 🌟 2. STANDALONE PAGES (NO NAVBAR) 🌟 */}
      <Route path="home" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <Home />
          </CheckAuth>} />
      <Route  path="/cart" 
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <Cart />
          </CheckAuth>
        } 
      />
      <Route path="account" element={ <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <Account />
          </CheckAuth>}/>
      <Route 
        path="/wishlist" 
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <Wishlist />
          </CheckAuth>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
            <Checkout />
          </CheckAuth>
        } 
      />

      {/* UNAUTHORIZED PAGE */}
      <Route path="/unauthPage" element={<UnAuth />} />

      {/* 404 */}
      <Route path="*" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
          <Index />
        </CheckAuth>} 
      />
    </Routes>
  );
};

export default App;