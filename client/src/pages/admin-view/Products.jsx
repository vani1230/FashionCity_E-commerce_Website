import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import axios from "axios";
import { toast } from "sonner";
import { FiX, FiTrash2, FiUpload, FiEdit } from "react-icons/fi";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  image: null,
};

const Products = () => {
  const brandsList = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levis", "Gucci"];
  const categories = ["Men", "Women", "Kids", "Footwear", "Accessories"];

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products/getting`,
      );
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setPreview(null);
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const url = editingProductId
        ? `${import.meta.env.VITE_API_URL}/api/admin/products/update/${editingProductId}`
        : `${import.meta.env.VITE_API_URL}/api/admin/products/add`;

      const method = editingProductId ? "put" : "post";

      await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        editingProductId
          ? "Product Updated Successfully"
          : "Product Added Successfully",
      );

      setFormData(initialFormData);
      setPreview(null);
      setEditingProductId(null);
      setIsSheetOpen(false);

      fetchProducts();
    } catch (error) {
      toast.error("Something went wrong", error);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product", error);
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice,
      totalStock: product.totalStock,
      image: null,
    });

    setPreview(product.image);
    setEditingProductId(product._id);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-purple-700">Products</h2>

        <Button
          onClick={() => {
            setEditingProductId(null);
            setFormData(initialFormData);
            setPreview(null);
            setIsSheetOpen(true);
          }}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Add Product
        </Button>
      </div>

      {/* PRODUCT GRID */}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-4 hover:shadow-lg transition flex flex-col"
              >
                <div className="relative">
                  <img
                    src={product.image.replace("/upload/", "/upload/w_200,q_auto,f_auto/")}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {/* Absolute Tag for Stock over Image (Optional, but looks nice) */}
                  {product.totalStock === 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      OUT OF STOCK
                    </span>
                  )}
                </div>

                <h3 className="mt-3 font-semibold line-clamp-1">{product.title}</h3>

                <p className="text-sm text-gray-500">
                  {product.category} • {product.brand}
                </p>

                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center gap-2">
                    {product.salePrice > 0 ? (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{product.price}
                        </span>

                        <span className="text-purple-700 font-bold text-lg">
                          ₹{product.salePrice}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-purple-700 font-bold text-lg">
                          ₹{product.price}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 🌟 NEW: LOW STOCK INDICATORS 🌟 */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-medium">
                      Stock: {product.totalStock}
                    </span>
                    {product.totalStock === 0 ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded mt-1">
                        Out of Stock
                      </span>
                    ) : product.totalStock < 10 ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded mt-1">
                        Only {product.totalStock} left
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 rounded-md transition-colors text-sm font-medium"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-md transition-colors text-sm font-medium"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHEET FORM */}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:w-[520px] overflow-y-auto rounded-l-3xl">
          <SheetHeader>
            <SheetTitle className="text-purple-700 text-xl">
              {editingProductId ? "Edit Product" : "Add Product"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* IMAGE */}

            <div className="space-y-2 mx-4">
              <label className="text-sm font-medium">Product Image</label>

              {!preview && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer bg-purple-50/50 hover:bg-purple-50 transition-colors text-purple-600">
                  <FiUpload size={24} className="mb-2" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              )}

              {preview && (
                <div className="relative w-32">
                  <img
                    src={preview}
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 transition-colors text-white p-1.5 rounded-full shadow-md"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* TITLE */}

            <div className="mx-4">
              <label className="text-sm font-medium">Product Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mx-4">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
              />
            </div>

            {/* CATEGORY + BRAND */}

            <div className="grid grid-cols-2 gap-4 mx-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Brand</label>
                <select
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="">Select</option>
                  {brandsList.map((brand) => (
                    <option key={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRICE */}

            <div className="grid grid-cols-2 gap-4 mx-4">
              <div>
                <label className="text-sm font-medium">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Sale Price (₹)</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* STOCK */}

            <div className="mx-4">
              <label className="text-sm font-medium">Total Stock</label>
              <input
                type="number"
                name="totalStock"
                required
                value={formData.totalStock}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>

            <SheetFooter className="px-4 pb-6 mt-8">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                {editingProductId ? "Update Product" : "Save Product"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Products;