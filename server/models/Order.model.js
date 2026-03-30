import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      address: String,
      city: String,
      pincode: String,
      phone: String,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
      required: true,
    },

    paymentId: {
      type: String, // Razorpay payment id
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    invoiceUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
