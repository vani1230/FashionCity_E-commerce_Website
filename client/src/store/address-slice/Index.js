import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  addresses: [],
  loading: false,
};

// ✅ ADD ADDRESS
export const addAddressThunk = createAsyncThunk(
  "address/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/address/add`,
        formData,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ GET ALL
export const fetchAddressThunk = createAsyncThunk(
  "address/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/get/${userId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ UPDATE
export const updateAddressThunk = createAsyncThunk(
  "address/update",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/address/update/${userId}/${addressId}`,
        formData,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ DELETE
export const deleteAddressThunk = createAsyncThunk(
  "address/delete",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/address/delete/${userId}/${addressId}`,
        { withCredentials: true }
      );
      return { ...res.data, addressId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(fetchAddressThunk.fulfilled, (state, action) => {
      state.addresses = action.payload.data;
    });

    builder.addCase(addAddressThunk.fulfilled, (state, action) => {
      state.addresses.unshift(action.payload.data);
    });

    builder.addCase(deleteAddressThunk.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(
        (a) => a._id !== action.payload.addressId
      );
    });

    builder.addCase(updateAddressThunk.fulfilled, (state, action) => {
      const index = state.addresses.findIndex(
        (a) => a._id === action.payload.data._id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload.data;
      }
    });
  },
});

export default addressSlice.reducer;
