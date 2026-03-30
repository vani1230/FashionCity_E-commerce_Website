# 🛒 MERN E-Commerce Platform 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A production-ready, full-stack eCommerce web application built with the MERN stack. It features a complete shopping experience including product browsing, cart and wishlist management, secure online payments via Razorpay, dynamic stock management, and automated email invoicing.

## 🌟 Key Features

### 🛍️ User Experience
* **Authentication:** Secure JWT-based authentication with HTTP-only cookies.
* **Product Discovery:** Browse products, view detailed descriptions, and manage wishlists across sessions.
* **Smart Cart System:** Real-time synchronized cart state between the frontend (Redux Toolkit) and backend MongoDB.
* **Checkout & Payments:** Support for both **Online Payments** (Razorpay integration with secure signature verification) and **Cash on Delivery (COD)**.
* **Order Tracking:** Track order status (Pending, Paid, Shipped, Delivered, Cancelled).
* **Automated Invoicing:** Dynamically generates PDF invoices upon order completion.
* **Email Notifications:** Automated order confirmation emails with the attached PDF invoice.

### 🛡️ Admin & System Capabilities
* **Admin Dashboard:** Comprehensive dashboard to manage products, monitor users, and update order statuses.
* **Dynamic Inventory Logic:** Prevents overselling by automatically deducting stock on order placement and restoring stock upon cancellation.
* **Role-Based Access:** Protected routes and REST API endpoints based on user roles (Admin vs. Customer).

---

## 💻 Tech Stack

**Frontend:**
* React.js
* Redux Toolkit (State management & Async Thunks)
* React Router (Dynamic routing)
* Tailwind CSS (UI & Styling)
* Axios (API requests)

**Backend:**
* Node.js & Express.js (REST API following MVC architecture)
* MongoDB & Mongoose (Database & ORM)
* JSON Web Tokens (JWT) (Cookie-based Auth)
* Razorpay API (Payment Gateway)

**Utilities:**
* PDFKit / Puppeteer (PDF Invoice Generation)
* Nodemailer (Email Service)

---

## 🏗️ System Architecture & Core Flows

* **State Management:** Utilizes Redux `createAsyncThunk` to handle complex API syncing (e.g., updating cart quantities and persisting them to the database instantly).
* **Payment Flow:** 1. Order created on Razorpay via backend.
    2. User completes payment on frontend.
    3. Backend verifies the Razorpay signature securely.
    4. Order status updates to `Paid` and stock is deducted.
* **Inventory Logic:** Strictly handles `product.stock -= item.quantity` upon order to maintain real-world inventory accuracy.

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
git clone [https://github.com/vani1230/FashionCity_E-commerce_Website]
cd your-repo-name

### 2. Setup the Backend
cd backend
npm install
Create .env using .env.example

### 3. Start the Backend server
nodemon server.js 

### 4. Setup Frontend
cd frontend
npm install
Create .env using .env.example

### 5. Start the Frontend
npm run dev