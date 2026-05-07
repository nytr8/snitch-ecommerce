import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    loading: false,
    error: null,
    allProducts: [],
  },

  reducers: {
    setSellerProduct: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
  },
});

export const { setError, setLoading, setSellerProduct, setAllProducts } =
  productSlice.actions;

export default productSlice.reducer;
