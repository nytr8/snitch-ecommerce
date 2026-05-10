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
    category: {
      type: String,
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
          amount: {
            type: Number,
          },

          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "CNY", "INR"],
            default: "INR",
          },
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
