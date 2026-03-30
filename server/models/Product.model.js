import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true },
    category: { type: String, required: true},
    brand: { type: String, required: true },
    price: { type: Number, required: true},
    salePrice: { type: Number, default: 0 },
    totalStock: {type: Number,required: true},
    image: { type: String, required: true},
    isFeatured: { type: Boolean, default: false}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;