import userModel from "../model/user.model";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { cookie } from "express-validator";

const generateToken = async (user) => {
  const { _id, email } = user;
  return jwt.sign({ _id, email }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export async function register(req, res) {
  const { fullname, contact, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with ${email} or ${contact} already exists`,
      });
    }

    const user = await userModel.create({
      fullname,
      contact,
      email,
      password,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User registration failed" });
    }

    const token = generateToken(user);
    cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
