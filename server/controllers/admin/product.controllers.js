import Product from "../../models/Product.model.js";
import cloudinary from "../../config/cloudinary.js";

//  adding products to the database, generating url form the claudinary
export const addProduct = async (req, res) => {

  try {

    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;

    let imageUrl = "";

    if (req.file) {

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "products"
        }
      );

      imageUrl = result.secure_url;
    }

    const product = new Product({
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      image: imageUrl
    });

    await product.save();

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// fetching products to display on the /admin/products
export const getProducts = async (req, res) => {

  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// deleting products from product.jsx when clicks delete button
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// editinf product details
export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;

    let updateData = {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    };

    // if new image uploaded
    if (req.file) {

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "products",
        }
      );

      updateData.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};