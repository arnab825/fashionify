import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  recommendations: [],
  basedOnTags: [],
};

export const fetchRecommendations = createAsyncThunk(
  "/recommendations/fetch",
  async ({ userId, limit = 8 }) => {
    const response = await axios.get(
      `http://localhost:8080/api/shop/recommendations?userId=${userId}&limit=${limit}`
    );
    return response.data;
  }
);

const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload.data || [];
        state.basedOnTags = action.payload.basedOnTags || [];
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.isLoading = false;
        state.recommendations = [];
        state.basedOnTags = [];
      });
  },
});

export default recommendationsSlice.reducer;
