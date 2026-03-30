import express from "express";
import { addProduct, getProducts,deleteProduct, updateProduct } from "../controllers/admin/product.controllers.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProduct);
router.get('/getting',getProducts)
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", upload.single("image"), updateProduct);

export default router;