import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  addToCart,
  createOrderController,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  verifyOrderController,
} from "../controller/cart.controller.js";
import { addToCartValidator } from "../validation/cart.validator.js";

const cartRouter = express.Router();

cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  addToCartValidator,
  addToCart,
);
cartRouter.get("/view", authenticateUser, getCart);
cartRouter.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  removeFromCart,
);
cartRouter.put(
  "/update/:productId/:variantId",
  authenticateUser,
  addToCartValidator,
  updateCartItemQuantity,
);
cartRouter.post(
  "/payment/create/order",
  authenticateUser,
  createOrderController,
);

cartRouter.post(
  "/payment/verify/order",
  authenticateUser,
  verifyOrderController,
);

export default cartRouter;
