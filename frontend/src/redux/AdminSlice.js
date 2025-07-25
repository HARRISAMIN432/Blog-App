import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
  name: "Admin",
  initialState: {
    isSigned: false,
  },
  reducers: {
    logout: (state) => {
      state.isSigned = false;
    },
    login: (state) => {
      state.isSigned = true;
    },
  },
});

export const { login, logout } = AdminSlice.actions;
export default AdminSlice.reducer;
