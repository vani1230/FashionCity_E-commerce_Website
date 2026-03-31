import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
🔥 THUNKS (API CALLS)
========================= */

/* FETCH CART */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/fetchAll`, {
        withCredentials: true,
      });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ADD TO CART */
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: product._id },
        { withCredentials: true },
      );
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* REMOVE ITEM */
export const removeFromCartAsync = createAsyncThunk(
  "cart/remove",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/remove`,
        { productId: id },
        { withCredentials: true },
      );
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* CLEAR CART */
export const clearCartAsync = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/delete`, {
        withCredentials: true,
      });
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// increase quantity
export const increaseQtyAsync = createAsyncThunk(
  "cart/increaseQty",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/increase`,
        { productId: id },
        { withCredentials: true }
      );

      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// decrease quantity
export const decreaseQtyAsync = createAsyncThunk(
  "cart/decreaseQty",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/decrease`,
        { productId: id },
        { withCredentials: true }
      );

      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
/* =========================
🧠 SLICE
========================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      /* REMOVE */
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      /* CLEAR */
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      })

      // increaes
      .addCase(increaseQtyAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      // decrease
      .addCase(decreaseQtyAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
  },
})

export default cartSlice.reducer;
