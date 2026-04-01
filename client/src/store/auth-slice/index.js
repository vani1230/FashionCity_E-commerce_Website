import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,   // important for route protection
  user: null,
  error: null,
  token:null
};

// REGISTER
export const RegisterUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// LOGIN
export const LoginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      console.log("TOKEN:", sessionStorage.getItem("token"));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


// CHECK AUTH (runs on refresh)
export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/checkAuth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const LogoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,{},
        {withCredentials: true}
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          withCredentials: true, // ✅ VERY IMPORTANT
        }
      );

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetTokenAndCredentials :(state)=>{
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    }
  },

  extraReducers: (builder) => {

    // REGISTER
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RegisterUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });

    // LOGIN
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.token = action.payload.token;
        sessionStorage.setItem('token',action.payload.token)
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message;
        state.token = null;
      });

    // CHECK AUTH
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      });

      // logout 
      builder
      .addCase(LogoutUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(LogoutUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(LogoutUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      });
      
      // on refresh
      builder
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserFromToken.rejected, (state) => {
        state.user = null;
      });

  }
});
export const {resetTokenAndCredentials} = authSlice.actions
export default authSlice.reducer;