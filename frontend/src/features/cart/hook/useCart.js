import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setItem } from "../state/cart.slice";
import {
  addToCart,
  createCartOrder,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../service/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddToCart = useCallback(
    async ({ productId, variantId, quantity, selectedAttribute }) => {
      try {
        const response = await addToCart({
          productId,
          variantId,
          quantity,
          selectedAttribute,
        });
        dispatch(setItem(response.cart.items));
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    },
    [dispatch],
  );

  const handleGetCart = useCallback(async () => {
    try {
      const response = await getCart();
      dispatch(setItem(response.cart.items));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [dispatch]);

  const handleRemoveFromCart = useCallback(
    async ({ productId, variantId, selectedAttribute }) => {
      try {
        const response = await removeFromCart({
          productId,
          variantId,
          selectedAttribute,
        });
        dispatch(setItem(response.cart.items));
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },
    [dispatch],
  );

  const handleUpdateQuantity = useCallback(
    async ({ productId, variantId, quantity, selectedAttribute }) => {
      try {
        const response = await updateCartQuantity({
          productId,
          variantId,
          quantity,
          selectedAttribute,
        });
        dispatch(setItem(response.cart.items));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },
    [dispatch],
  );

  const handleCreateCartOrder = useCallback(async () => {
    try {
      const response = await createCartOrder();
      return response.order;
    } catch (error) {
      console.error("Error creating cart order:", error);
      throw error;
    }
  }, []);

  return {
    handleAddToCart,
    handleGetCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleCreateCartOrder,
  };
};
