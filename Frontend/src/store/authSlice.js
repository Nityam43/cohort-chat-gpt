import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://cohort-chat-gpt.onrender.com"
    : "http://localhost:3000");

// Async thunk to check authentication status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      console.log("=== AUTH CHECK START ===");
      console.log("Checking auth status with API_URL:", API_URL);
      console.log("Production mode:", import.meta.env.PROD);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
        signal: controller.signal,
        timeout: 8000, // Additional axios timeout
      });

      clearTimeout(timeoutId);
      console.log("Auth check successful:", response.data);
      console.log("=== AUTH CHECK SUCCESS ===");
      return response.data.user;
    } catch (error) {
      console.error("=== AUTH CHECK FAILED ===");
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          withCredentials: error.config?.withCredentials,
        },
      });

      // Handle timeout specifically
      if (error.name === "AbortError" || error.code === "ECONNABORTED") {
        console.log("Auth check timed out - treating as not authenticated");
        return rejectWithValue("Authentication check timed out");
      }

      // Handle network errors
      if (!error.response) {
        console.log("Network error - treating as not authenticated");
        return rejectWithValue("Network error - not authenticated");
      }

      // Handle 401 specifically
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - user is not authenticated");
        return rejectWithValue("Not authenticated");
      }

      console.log(
        "Auth check failed with error - treating as not authenticated"
      );
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated"
      );
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, fullName, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { email, fullName, password },
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    hasCheckedAuth: false, // Track if we've checked auth status on app load
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setHasCheckedAuth: (state, action) => {
      state.hasCheckedAuth = action.payload;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.hasCheckedAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.hasCheckedAuth = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.hasCheckedAuth = true;
        state.error = action.payload;
        console.log(
          "Auth check rejected, user is not authenticated:",
          action.payload
        );
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setHasCheckedAuth, resetAuthState } =
  authSlice.actions;
export default authSlice.reducer;
