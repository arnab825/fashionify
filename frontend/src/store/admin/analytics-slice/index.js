import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const initialState = {
  isLoading: false,
  data: null,
};

export const fetchAnalytics = createAsyncThunk(
  "/admin/fetchAnalytics",
  async ({ startDate, endDate }) => {
    const response = await api.get(
      `/api/admin/analytics?start=${startDate}&end=${endDate}`
    );
    return response.data;
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchAnalytics.rejected, (state) => {
        state.isLoading = false;
        state.data = null;
      });
  },
});

export default adminAnalyticsSlice.reducer;
