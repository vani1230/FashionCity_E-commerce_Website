import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { FiMapPin, FiPlus, FiX } from "react-icons/fi";
import {
  addAddressThunk,
  fetchAddressThunk,
  updateAddressThunk,
  deleteAddressThunk
} from "../../store/address-slice/Index.js";

const initialAddressFormData = {
  type: "Home", name: "", phone: "", address: "", city: "", state: "", zip: "", isDefault: false
};

const Address = () => {
  const { user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const userId = user?._id;

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState(initialAddressFormData);

  useEffect(() => {
    if (userId) dispatch(fetchAddressThunk(userId));
  }, [dispatch, userId]);

  const handleOpenAddForm = () => {
    setCurrentAddressId(null);
    setAddressFormData(initialAddressFormData);
    setShowAddressForm(true);
  };

  const handleOpenEditForm = (address) => {
    setCurrentAddressId(address._id);
    setAddressFormData({
      type: address.notes?.split("|")[0]?.trim() || "Home",
      name: user?.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.notes?.split("|")[1]?.trim() || "",
      zip: address.pincode || "",
      isDefault: false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    dispatch(deleteAddressThunk({ userId, addressId })).then((data) => {
      if (data?.meta?.requestStatus === "fulfilled") {
        toast.success("Address deleted");
        dispatch(fetchAddressThunk(userId));
      }
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, address, city, state, zip } = addressFormData;

    if (!name || !phone || !address || !city || !state || !zip) {
      toast.error("Please fill all fields");
      return;
    }

    const payloadData = {
      userId, address: addressFormData.address, city: addressFormData.city,
      pincode: addressFormData.zip, phone: addressFormData.phone,
      notes: `${addressFormData.type} | ${addressFormData.state}`
    };

    if (currentAddressId) {
      dispatch(updateAddressThunk({ userId, addressId: currentAddressId, formData: payloadData })).then((data) => {
        if (data?.meta?.requestStatus === "fulfilled") {
          toast.success("Address updated");
          setShowAddressForm(false);
          dispatch(fetchAddressThunk(userId));
        }
      });
    } else {
      dispatch(addAddressThunk(payloadData)).then((data) => {
        if (data?.meta?.requestStatus === "fulfilled") {
          toast.success("Address added");
          setShowAddressForm(false);
          dispatch(fetchAddressThunk(userId));
        }
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Saved Addresses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div onClick={handleOpenAddForm} className="bg-white/30 backdrop-blur-sm border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-pink-50/50 transition-colors min-h-[200px] group">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiPlus size={24} />
            </div>
            <p className="font-bold text-pink-600">Add New Address</p>
          </div>

          {addresses?.map((addr) => {
            const type = addr.notes?.split("|")[0]?.trim() || "Home";
            const state = addr.notes?.split("|")[1]?.trim() || "";

            return (
              <div key={addr._id} className="bg-white/50 backdrop-blur-md border border-white rounded-2xl p-6 shadow-sm relative group flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-100 text-purple-600 p-1.5 rounded-lg"><FiMapPin size={16}/></div>
                  <span className="font-extrabold text-gray-800 capitalize">{type}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{user?.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-1">{addr.address}, {addr.city}</p>
                <p className="text-sm text-gray-500 mb-4">{state ? `${state} - ` : ""}{addr.pincode}</p>
                <p className="text-sm font-medium text-gray-600 mb-4">{addr.phone}</p>
                <div className="flex gap-3 mt-auto pt-4">
                  <button onClick={() => handleOpenEditForm(addr)} className="text-xs font-bold text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg transition-colors flex-1">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex-1">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative">
            <button onClick={() => setShowAddressForm(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 shadow-sm">
              <FiX size={18} />
            </button>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{currentAddressId ? "Edit Address" : "Add New Address"}</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Full Name</label>
                  <input type="text" name="name" value={addressFormData.name} onChange={handleAddressChange} placeholder="John Doe" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Phone</label>
                  <input type="text" name="phone" value={addressFormData.phone} onChange={handleAddressChange} placeholder="+91 98765 43210" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Address</label>
                  <input type="text" name="address" value={addressFormData.address} onChange={handleAddressChange} placeholder="House No, Street, Area" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">City</label>
                  <input type="text" name="city" value={addressFormData.city} onChange={handleAddressChange} placeholder="City" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">State</label>
                  <input type="text" name="state" value={addressFormData.state} onChange={handleAddressChange} placeholder="State" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Zip Code / Pincode</label>
                  <input type="text" name="zip" value={addressFormData.zip} onChange={handleAddressChange} placeholder="123456" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Address Type</label>
                  <select name="type" value={addressFormData.type} onChange={handleAddressChange} className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm text-gray-700 font-medium">
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 pb-4">
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input type="checkbox" name="isDefault" checked={addressFormData.isDefault} onChange={handleAddressChange} className="w-4 h-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500" />
                  <span className="text-sm font-bold text-gray-600">Set as Default Address</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 active:scale-95 transition-all">
                {currentAddressId ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Address;