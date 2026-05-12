import mongoose from "mongoose";
import { priceSchema } from "./priceSchema.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    variants: [
      {
        attributes: {
          name: {
            type: String,
            // Example: "Size"
          },

          values: [
            {
              type: String,
              // Example: "M", "L", "XL"
            },
          ],
        },

        color: {
          type: String,
          // Example: "Black", "White"
        },

        stock: {
          type: Number,
          default: 0,
          required: true,
        },

        images: [
          {
            url: {
              type: String,
            },
          },
        ],

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

const productModel = mongoose.model("product", productSchema);

export default productModel;
