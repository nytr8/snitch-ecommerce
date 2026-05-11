import express from "express";
import { loginValidator, registerValidator } from "../validation/auth.validator.js";
import { getMe, login, register } from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/me", authenticateUser, getMe);

export default authRouter;
