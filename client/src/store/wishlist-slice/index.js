import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
🔥 THUNKS
========================= */

/* FETCH WISHLIST */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist/fetch", {
        withCredentials: true,
      });
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ADD */
export const addToWishlistAsync = createAsyncThunk(
  "wishlist/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wishlist/add",
        { productId: product._id },
        { withCredentials: true },
      );
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* REMOVE */
export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/remove",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wishlist/remove",
        { productId: id },
        { withCredentials: true },
      );
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* CLEAR ALL */
export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete("http://localhost:5000/api/wishlist/delete-all", {
        withCredentials: true,
      });
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* =========================
🧠 SLICE
========================= */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    isLoading: false,
    actionLoadingId: null,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      /* ADD */
      .addCase(addToWishlistAsync.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg._id;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.actionLoadingId = null;
      })

      /* REMOVE */
      .addCase(removeFromWishlistAsync.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.actionLoadingId = null;
      })

      /* CLEAR */
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;
