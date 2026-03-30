import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🟡 COD ORDER
export const createCODOrderThunk = createAsyncThunk(
  "order/createCOD",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/cod",
        payload,
        { withCredentials: true }, // 🔥 important
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 🟢 VERIFY PAYMENT
export const verifyPaymentThunk = createAsyncThunk(
  "order/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/verify-payment",
        payload,
        { withCredentials: true },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// fetch order
export const fetchUserOrdersThunk = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/order/user/${userId}`,
        { withCredentials: true },
      );

      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

//  fetch all orders -> admin
export const fetchAllOrdersThunk = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/admin/all", {
        withCredentials: true,
      });
      // console.log(res.data.orders)
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// updating status by  admin
export const updateOrderStatusThunk = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/order/${orderId}`,
        { status },
        { withCredentials: true },
      );

      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// fetchning data for admin dashboard
export const fetchDashboardDataThunk = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/admin/all", {
        withCredentials: true,
      });

      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

//  reducers
const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    error: null,
    order: null,
    orders: [],
  },
  dashboard: {
    totalRevenue: 0,
    totalOrders: 0,
    recentOrders: [],
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.order = null;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // COD
      .addCase(createCODOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCODOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(createCODOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // VERIFY PAYMENT
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // fetching order
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAllOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // 🔴 ADMIN: UPDATE ORDER STATUS
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders
          .map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order,
          )
          .addCase(fetchDashboardDataThunk.fulfilled, (state, action) => {
            const orders = action.payload;
            state.dashboard.totalOrders = orders.length;
            state.dashboard.totalRevenue = orders.reduce(
              (acc, order) => acc + order.totalAmount,
              0,
            );
            state.dashboard.recentOrders = orders.slice(0, 5);
          });
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
