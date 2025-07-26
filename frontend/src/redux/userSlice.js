import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    username: "",
  },
  reducers: {
    userLogin: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
    userLogout: (state) => {
      state.id = "";
      state.username = "";
    },
  },
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;
