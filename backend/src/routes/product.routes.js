import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controller/product.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // Limit file size to 5MB

const productRouter = Router();

productRouter.post(
  "/create",
  authenticateSeller,
  upload.array("images", 7),
  createProduct,
);

export default productRouter;
