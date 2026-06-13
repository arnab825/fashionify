import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const initialState = {
  isLoading: false,
  productList: [],
  lowStockProducts: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await api.post(
      "/api/admin/products/add",
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await api.get("/api/admin/products/get");
    return result?.data;
  }
);

export const fetchLowStockProducts = createAsyncThunk(
  "/products/fetchLowStockProducts",
  async () => {
    const result = await api.get("/api/admin/products/low-stock");
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await api.put(
      `/api/admin/products/edit/${id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await api.delete(`/api/admin/products/delete/${id}`);
    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.lowStockProducts = action.payload.data;
      })
      .addCase(fetchLowStockProducts.rejected, (state) => {
        state.lowStockProducts = [];
      });
  },
});

export default AdminProductsSlice.reducer;
