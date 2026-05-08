import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    authChecked: false,
    error: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAuthChecked, setError, setLoading, setUser } =
  authSlice.actions;

export default authSlice.reducer;
