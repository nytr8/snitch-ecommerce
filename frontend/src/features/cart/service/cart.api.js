import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api/cart",
  withCredentials: true,
});

export const addToCart = async ({ productId, variantId, quantity, selectedAttribute }) => {
  try {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
    const response = await api.post(url, {
      quantity,
      selectedAttribute,
    });
    return response.data;
  } catch (error) {
    console.error("Add to cart error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to add to cart");
  }
};

export const getCart = async () => {
  try {
    const response = await api.get("/view");
    return response.data;
  } catch (error) {
    console.error("Get cart error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to get cart");
  }
};

export const removeFromCart = async ({ productId, variantId, selectedAttribute }) => {
  try {
    const url = variantId ? `/remove/${productId}/${variantId}` : `/remove/${productId}`;
    const response = await api.delete(url, {
      params: { selectedAttribute }
    });
    return response.data;
  } catch (error) {
    console.error("Remove from cart error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to remove from cart");
  }
};

export const updateCartQuantity = async ({ productId, variantId, quantity, selectedAttribute }) => {
  try {
    const url = variantId ? `/update/${productId}/${variantId}` : `/update/${productId}`;
    const response = await api.put(url, {
      quantity,
      selectedAttribute,
    });
    return response.data;
  } catch (error) {
    console.error("Update cart error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to update cart");
  }
};


