import express from "express";
import { loginValidator, registerValidator } from "../validation/validator.js";
import { login, register } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

export default authRouter;
