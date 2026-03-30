import Wishlist from "../../models/Wishlist.model.js";

// Format wishlist
const formatWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId })
    .populate("items.productId");

  if (!wishlist) return { items: [] };

  // 🧹 remove deleted products
  const validItems = wishlist.items.filter(
    (item) => item.productId !== null
  );

  // 🔄 update DB if needed
  if (validItems.length !== wishlist.items.length) {
    wishlist.items = validItems;
    await wishlist.save();
  }

  return {
    items: validItems.map((item) => ({
      ...item.productId._doc,
      productId: item.productId._id,
    })),
  };
};


// fetch wishlist
export const fetchWishList = async (req, res) => {
  try {
    const userId = req.user.id;

    const formattedWishlist = await formatWishlist(userId);

    res.json({
      success: true,
      wishlist: formattedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// add to wishlist
export const addToWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({ productId });
    }

    await wishlist.save();

    const formattedWishlist = await formatWishlist(userId);

    res.json({
      success: true,
      wishlist: formattedWishlist,
    });
  } catch (error) {
    console.log("ADD WISHLIST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//  remove from wishlist
export const removeFromWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({
        success: true,
        wishlist: { items: [] },
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    const formattedWishlist = await formatWishlist(userId);

    res.json({
      success: true,
      wishlist: formattedWishlist,
    });
  } catch (error) {
    console.log("REMOVE WISHLIST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// clear 
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }

    res.json({
      success: true,
      wishlist: { items: [] },
    });
  } catch (error) {
    console.log("CLEAR WISHLIST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};