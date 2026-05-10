import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  createProduct,
  getAllProducts,
  getSellerProducts,
  deleteProduct,
  getProductById,
} from "../services/product.api";
import {
  addSellerProduct,
  setLoading,
  setError,
  setSellerProduct,
  setAllProducts,
  removeSellerProduct,
  setProductDetails,
} from "../state/product.slice";

const getErrorMessage = (error, fallbackMessage) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.message || fallbackMessage;
};

const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = useCallback(
    async (productData) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await createProduct(productData);
        dispatch(addSellerProduct(res.product));
        return { success: true, data: res };
      } catch (error) {
        const message = getErrorMessage(error, "Failed to create product");
        dispatch(setError(message));
        return { success: false, message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleGetSellerProduct = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await getSellerProducts();
      dispatch(setSellerProduct(res?.products || []));
      return { success: true, data: res };
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch seller products");
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetAllProducts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await getAllProducts();
      dispatch(setAllProducts(res?.products || []));
      return { success: true, data: res };
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch all products");
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleDeleteProduct = useCallback(
    async (productId) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await deleteProduct(productId);
        dispatch(removeSellerProduct(productId));
        return { success: true, data: res };
      } catch (error) {
        const message = getErrorMessage(error, "Failed to delete product");
        dispatch(setError(message));
        return { success: false, message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );
  const handleProductDetails = useCallback(
    async (productId) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await getProductById(productId);
        dispatch(setProductDetails(res.product));
        return { success: true, data: res };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to fetch product details",
        );
        dispatch(setError(message));
        return { success: false, message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return {
    handleCreateProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleDeleteProduct,
    handleProductDetails,
  };
};

export default useProduct;
