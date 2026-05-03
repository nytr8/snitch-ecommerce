import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts } from "../services/product.api";
import { setLoading, setError, setSellerProduct } from "../state/product.slice";

const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(productData) {
    dispatch(setLoading(true));
    try {
      const res = await createProduct(productData);
      dispatch(setSellerProduct(res.product));
    } catch (error) {
      console.error("Error creating product:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetSellerProduct() {
    dispatch(setLoading(true));
    try {
      const res = await getSellerProducts();
      dispatch(setSellerProduct(res.products));
    } catch (error) {
      console.error("Error creating product:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleCreateProduct, handleGetSellerProduct };
};

export default useProduct;
