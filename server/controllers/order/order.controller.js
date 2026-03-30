import crypto from "crypto";
import Order from '../../models/Order.model.js'
import { generateInvoice } from '../../utils/generateInvoice.js';
import { sendOrderEmail } from "../../utils/sendEmail.js";
import Product from '../../models/Product.model.js';

const updateProductStock = async (cartItems) => {
  for (const item of cartItems) {
    const productId = item.productId || item._id;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error(`Product not found`);
    }

    // ❌ OUT OF STOCK
    if (product.totalStock < item.quantity) {
      throw new Error(`${product.title} is out of stock`);
    }

    // 🔻 REDUCE STOCK
    product.totalStock -= item.quantity;

    await product.save();
  }
};
/**
 * 🟢 1. VERIFY RAZORPAY PAYMENT + SAVE ORDER
 */
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      address,
      totalAmount,
      userId,
      paymentMethod,
    } = req.body;
    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
    // 🔻 UPDATE STOCK FIRST
    await updateProductStock(cartItems);

    // 🧾 Create Order
    let order = await Order.create({
      user: userId,
      items: cartItems.map((item) => ({
        productId: item.productId || item._id,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod,
      paymentId: razorpay_payment_id,
      totalAmount,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: "paid",
    });

    // 🔥 POPULATE USER
    order = await order.populate("user", "name email");

    // 🧾 GENERATE PDF
    const pdfPath = await generateInvoice(order);

    // 💾 SAVE INVOICE
    order.invoiceUrl = pdfPath;
    await order.save();

    // 📧 SEND EMAIL
    await sendOrderEmail(order.user, order, pdfPath);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🟡 2. CREATE COD ORDER
 */
export const createCODOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount, userId } = req.body;
    // 🔥 UPDATE STOCK
    await updateProductStock(cartItems);
    let order = await Order.create({
      user: userId,
      items: cartItems.map((item) => ({
        productId: item.productId || item._id,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod: "cod",
      totalAmount,
      isPaid: false,
      orderStatus: "pending",
    });

    // 🔥 POPULATE USER
    order = await order.populate("user", "name email");

    // 🧾 GENERATE PDF
    const pdfPath = await generateInvoice(order);

    // 💾 SAVE INVOICE
    order.invoiceUrl = pdfPath;
    await order.save();

    // 📧 SEND EMAIL
    await sendOrderEmail(order.user, order, pdfPath);

    res.status(201).json({
      success: true,
      message: "COD Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("COD ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🔵 3. GET USER ORDERS
 */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🟣 4. GET SINGLE ORDER
 */
export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🔴 5. UPDATE ORDER STATUS (ADMIN)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // 🟡 IF ORDER IS CANCELLED → RESTORE STOCK
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    // 🔄 UPDATE STATUS
    order.orderStatus = status;
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};