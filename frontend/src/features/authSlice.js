//doubt in redux
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "authSlice",
  initialState,   //already defined above
  reducers: {    //reducers are functions to manage states
    userLoggedIn: (state, action) => { // state provides the access to the previous state and action has arguments for the function userLoggedIn
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    userLoggedOut: (state) => {                    // action (parameters) is not required
      (state.user = null), (state.isAuthenticated = false);
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;
