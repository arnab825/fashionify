import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  eligibility: { eligible: false, reason: "", isChecking: false },
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
      formdata,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/shop/review/${id}`
  );
  return response.data;
});

export const checkRatingEligibility = createAsyncThunk(
  "/order/checkEligibility",
  async ({ productId, userId }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/eligibility/${productId}?userId=${userId}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    resetEligibility: (state) => {
      state.eligibility = { eligible: false, reason: "", isChecking: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(checkRatingEligibility.pending, (state) => {
        state.eligibility.isChecking = true;
      })
      .addCase(checkRatingEligibility.fulfilled, (state, action) => {
        state.eligibility = {
          eligible: action.payload.eligible,
          reason: action.payload.reason || "",
          isChecking: false,
        };
      })
      .addCase(checkRatingEligibility.rejected, (state) => {
        state.eligibility = { eligible: false, reason: "", isChecking: false };
      });
  },
});

export const { resetEligibility } = reviewSlice.actions;
export default reviewSlice.reducer;
