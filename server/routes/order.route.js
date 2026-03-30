import express from "express";
import {
  verifyPaymentAndCreateOrder,
  createCODOrder,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders
} from "../controllers/order/order.controller.js";

import { AuthMiddlewareController } from '../middlewares/AuthMiddleware.js'

const router = express.Router();

// 🟢 Razorpay success + order
router.post("/verify-payment",AuthMiddlewareController, verifyPaymentAndCreateOrder);

// 🟡 COD order
router.post("/cod",createCODOrder);

// 🔵 Get all orders of user
router.get("/user/:userId",getUserOrders);

// 🟣 Get single order
router.get("/:orderId", getSingleOrder);

// 🔴 Admin update status
router.put("/:orderId", updateOrderStatus);

router.get("/admin/all", getAllOrders);
export default router;