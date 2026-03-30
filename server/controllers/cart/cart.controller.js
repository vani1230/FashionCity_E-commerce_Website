import Cart from "../../models/Cart.model.js";

/* 🔥 Helper function (VERY IMPORTANT) */
const formatCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) return { items: [] };

  return {
    items: cart.items.map((item) => ({
      ...item.productId._doc,
      quantity: item.quantity,
    })),
  };
};

/* =========================
   ➕ ADD TO CART
========================= */
export const addtoCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const formattedCart = await formatCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (error) {
    console.log("ADD ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   ❌ REMOVE ITEM
========================= */
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: true,
        cart: { items: [] },
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    const formattedCart = await formatCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (error) {
    console.log("REMOVE ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   📦 FETCH CART
========================= */
export const fetchAllCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const formattedCart = await formatCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (error) {
    console.log("FETCH ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   🧹 CLEAR CART
========================= */
export const clearAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      cart: { items: [] },
    });
  } catch (error) {
    console.log("CLEAR ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   ➕ INCREASE QTY
========================= */
export const increaseQty = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    }

    await cart.save();

    const formattedCart = await formatCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (error) {
    console.log("INCREASE ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   ➖ DECREASE QTY
========================= */
export const decreaseQty = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item && item.quantity > 1) {
      item.quantity -= 1;
    }

    await cart.save();

    const formattedCart = await formatCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (error) {
    console.log("DECREASE ERROR:", error);
    res.status(500).json({ success: false });
  }
};