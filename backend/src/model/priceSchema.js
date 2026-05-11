import mongoose from "mongoose";
export const priceSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "CNY", "INR"],
      default: "INR",
    },
  },
  { _id: false, _v: false },
);
