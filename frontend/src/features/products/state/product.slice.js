import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    loading: false,
    error: null,
    allProducts: [],
    productDetails: null,
    productVariants: [],
  },

  reducers: {
    setSellerProduct: (state, action) => {
      state.sellerProducts = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    addSellerProduct: (state, action) => {
      if (action.payload) {
        state.sellerProducts = [action.payload, ...state.sellerProducts];
      }
    },
    removeSellerProduct: (state, action) => {
      state.sellerProducts = state.sellerProducts.filter(
        (product) => product._id !== action.payload,
      );
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
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    setProductVariants: (state, action) => {
      state.productVariants = action.payload;
    },
  },
});

export const {
  setError,
  setLoading,
  setSellerProduct,
  addSellerProduct,
  removeSellerProduct,
  setAllProducts,
  setProductDetails,
  setProductVariants,
} = productSlice.actions;

export default productSlice.reducer;
