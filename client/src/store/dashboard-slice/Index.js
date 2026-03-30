import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🟢 FETCH ORDERS (Dashboard)
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

// 🟣 FETCH USERS
export const fetchUsersThunk = createAsyncThunk(
  "dashboard/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        withCredentials: true,
      });

      return res.data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// 🔴 UPDATE ORDER STATUS
export const updateOrderStatusThunk = createAsyncThunk(
  "dashboard/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/order/${orderId}`,
        { status },
        { withCredentials: true },
      );

      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// 🧠 INITIAL STATE
const initialState = {
  loading: false,
  error: null,

  dashboard: {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [],
    usersList: [],
  },

  orders: [], // for admin panel
};

// 🧾 SLICE
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // 🟢 FETCH DASHBOARD DATA
      .addCase(fetchDashboardDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        const orders = action.payload;
        state.orders = orders;
        state.dashboard.totalOrders = orders.length;
        state.dashboard.totalRevenue = orders.reduce(
          (acc, order) => acc + order.totalAmount,
          0,
        );
        state.dashboard.recentOrders = orders.slice(0, 5);
      })
      .addCase(fetchDashboardDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🟣 FETCH USERS
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.dashboard.totalUsers = action.payload.length;
        state.usersList = action.payload; // 🔥 important
      })
      // 🔴 UPDATE ORDER STATUS
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        );
        // update recent orders also
        state.dashboard.recentOrders = state.orders.slice(0, 5);
      });
  },
});

export default dashboardSlice.reducer;
