import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const initialState = {
  isLoading: false,
  wishlistItems: [],
};

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }) => {
    const response = await api.post(
      "/api/shop/wishlist/add",
      { userId, productId }
    );
    return response.data;
  }
);

export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (userId) => {
    const response = await api.get(`/api/shop/wishlist/get/${userId}`);
    return response.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }) => {
    const response = await api.delete(
      `/api/shop/wishlist/delete/${userId}/${productId}`
    );
    return response.data;
  }
);

const shoppingWishlistSlice = createSlice({
  name: "shoppingWishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload.data;
      })
      .addCase(fetchWishlistItems.rejected, (state) => {
        state.isLoading = false;
        state.wishlistItems = [];
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload.data;
      })
      .addCase(addToWishlist.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload.data;
      })
      .addCase(removeFromWishlist.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingWishlistSlice.reducer;
