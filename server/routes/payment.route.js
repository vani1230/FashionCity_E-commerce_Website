import express from "express";
import { createOrder } from '../controllers/payment/payment.controller.js';
import {AuthMiddlewareController} from '../middlewares/AuthMiddleware.js'
const router = express.Router();

router.post("/create-order", createOrder);

export default router;