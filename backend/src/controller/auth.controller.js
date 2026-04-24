import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const sendTokenResponse = async (user, res, message) => {
  const { _id, email, contact, fullname, role } = user;
  const token = jwt.sign({ id: _id, email, role }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token);
  res.status(201).json({
    success: true,
    message: `${message}`,
    user: {
      id: _id,
      email,
      contact,
      fullname,
      role,
    },
    token,
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

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  const { email, contact, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
