import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.post("/create", verifyUser, createProduct);

export default productRouter;
