import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  dashboardStats: {}, // ✅ Added this
};

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const response = await axios.get("http://localhost:5000/api/common/feature/get");
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (image) => {
    const response = await axios.post("http://localhost:5000/api/common/feature/add", {
      image,
    });
    return response.data;
  }
);

// ✅ NEW — Fetch dashboard statistics (stock, profit, etc.)
export const getDashboardStats = createAsyncThunk(
  "common/getDashboardStats",
  async () => {
    const response = await axios.get("http://localhost:5000/api/admin/dashboard-stats", {
      withCredentials: true,
    });
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Feature Images
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      // ✅ Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state) => {
        state.isLoading = false;
        state.dashboardStats = {};
      });
  },
});

export default commonSlice.reducer;
