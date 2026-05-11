import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { addToCart } from "../controller/cart.controller.js";
import { addToCartValidator } from "../validation/cart.validator.js";

const cartRouter = express.Router();

cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  addToCartValidator,
  addToCart,
);
cartRouter.get("/view", authenticateUser, getCart);

export default cartRouter;
