import express from "express";
import { registerValidator } from "../validation/validator.js";
import { register } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);

export default authRouter;
