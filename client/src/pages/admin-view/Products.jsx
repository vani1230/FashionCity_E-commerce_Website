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
import { FiX, FiTrash2, FiUpload, FiEdit, FiPlus, FiBox } from "react-icons/fi";

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
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setPreview(URL.createObjectURL(file));
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-xl border border-white p-5 sm:p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2.5 tracking-tight">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-inner">
                <FiBox size={24} />
              </div>
              Inventory
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Manage your product catalog and monitor stock levels.</p>
          </div>

          <Button
            onClick={() => {
              setEditingProductId(null);
              setFormData(initialFormData);
              setPreview(null);
              setIsSheetOpen(true);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-5 px-6 rounded-xl shadow-lg hover:shadow-purple-300/50 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
          >
            <FiPlus size={20} /> Add Product
          </Button>
        </div>

        {/* PRODUCT GRID */}
        <div>
          {products.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-10 sm:p-16 text-center shadow-lg flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-300 mb-4">
                <FiBox size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500">Click the "Add Product" button above to populate your inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/80 backdrop-blur-xl border border-white rounded-[1.5rem] p-4 shadow-lg shadow-purple-100/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-50 mb-4">
                    <img
                      src={product.image.replace("/upload/", "/upload/w_400,q_auto,f_auto/")}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Absolute Tag for Stock */}
                    {product.totalStock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="font-extrabold text-gray-800 text-base sm:text-lg line-clamp-2 leading-tight mb-1">
                      {product.title}
                    </h3>

                    <p className="text-xs font-medium text-gray-400 mb-3">
                      {product.category} <span className="mx-1">•</span> {product.brand}
                    </p>

                    <div className="mt-auto flex justify-between items-end pb-4 border-b border-gray-100 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.salePrice > 0 ? (
                          <>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-xl">
                              ₹{product.salePrice}
                            </span>
                            <span className="text-gray-400 line-through text-xs sm:text-sm font-semibold">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-xl">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* LOW STOCK INDICATORS */}
                      <div className="flex flex-col items-end">
                        {product.totalStock === 0 ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md mt-1">
                            Empty
                          </span>
                        ) : product.totalStock < 10 ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md mt-1">
                            {product.totalStock} Left!
                          </span>
                        ) : (
                           <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                             Stock: {product.totalStock}
                           </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm"
                      >
                        <FiEdit size={16} /> Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHEET FORM */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-[500px] md:max-w-[600px] overflow-y-auto rounded-l-2xl sm:rounded-l-[2rem] p-0 border-l-0 shadow-2xl">
            
            <div className="bg-white px-6 sm:px-8 py-6 border-b border-gray-100 sticky top-0 z-10 flex justify-between items-center">
              <SheetTitle className="text-2xl font-black text-gray-800 flex items-center gap-2">
                 <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                   {editingProductId ? <FiEdit size={20} /> : <FiPlus size={20} />}
                 </div>
                {editingProductId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
              {/* Optional: Add custom close button here if needed, shadcn handles default */}
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              
              {/* IMAGE UPLOAD */}
              <div className="space-y-3">
                <label className="text-sm font-extrabold text-gray-700 uppercase tracking-wider">Product Image</label>

                {!preview && (
                  <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-purple-200 rounded-2xl cursor-pointer bg-purple-50/50 hover:bg-purple-50 hover:border-purple-400 transition-all text-purple-600 group">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                       <FiUpload size={24} />
                    </div>
                    <span className="text-sm font-bold">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1 font-medium">JPEG, PNG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                )}

                {preview && (
                  <div className="relative w-full sm:w-48 aspect-square">
                    <img
                      src={preview}
                      className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 transition-colors text-white p-2 rounded-full shadow-xl hover:scale-110"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Product Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Nike Air Max 270"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white text-sm sm:text-base font-medium"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Detail the product features..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none focus:bg-white text-sm sm:text-base font-medium"
                />
              </div>

              {/* CATEGORY + BRAND GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Category</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white text-sm sm:text-base font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Brand</label>
                  <select
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white text-sm sm:text-base font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    {brandsList.map((brand) => (
                      <option key={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICE + STOCK GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Sale Price (₹)</label>
                  <input
                    type="number"
                    name="salePrice"
                    placeholder="0.00"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Total Stock</label>
                  <input
                    type="number"
                    name="totalStock"
                    required
                    placeholder="0"
                    value={formData.totalStock}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-6 sm:pt-8 mt-8 border-t border-gray-100">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-xl font-extrabold text-lg transition-all shadow-xl hover:shadow-purple-400/50 active:scale-95"
                >
                  {editingProductId ? "Update Product Details" : "Publish Product"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Products;