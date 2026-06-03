import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  isLoading: false,
};

export const getAllUsersForAdmin = createAsyncThunk(
  "/users/getAllUsersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/users/get`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateUserRole = createAsyncThunk(
  "/users/updateUserRole",
  async ({ id, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/users/update-role/${id}`,
      { role },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "/users/deleteUser",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/users/delete/${id}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

const adminUserSlice = createSlice({
  name: "adminUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getAllUsersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      });
  },
});

export default adminUserSlice.reducer;
