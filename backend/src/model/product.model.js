import mongoose from "mongoose";

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
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "CNY", "INR"],
        required: true,
      },
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
    variants: [
      {
        attribute: {
          type: String,
          required: true,
          // Example: "M", "L", "XL"
        },

        color: {
          type: String,
          required: true,
          // Example: "Black", "White"
        },

        stock: {
          type: Number,
          default: 0,
        },

        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],

        price: {
          amount: {
            type: Number,
            required: true,
          },

          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "CNY", "INR"],
            default: "INR",
          },
        },

        sku: {
          type: String,
          unique: true,
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
