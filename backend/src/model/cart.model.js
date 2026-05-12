import mongoose from "mongoose";
import { priceSchema } from "./priceSchema.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          required: false, // Made optional for base products
        },
        selectedAttribute: {
          type: String,
        },


        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
