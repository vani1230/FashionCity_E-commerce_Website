import Address from "../../models/address.model.js"

// ✅ ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const { address, city, pincode, phone, notes } = req.body;

    const newAddress = await Address.create({
      userID: req.user.id, // from auth middleware
      address,
      city,
      pincode,
      phone,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// ✅ FETCH ALL ADDRESSES
export const fetchAll = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const addresses = await Address.find({ userID: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: addresses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// ✅ UPDATE ADDRESS
export const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, userID: userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// ✅ DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      userID: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};