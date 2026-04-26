import productModel from "../model/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const seller = req.user;
  const { title, description, priceAmount, priceCurrency } = req.body;
  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        const res = await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: res.url };
      }),
    );
    const product = await productModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
      seller: seller._id,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;
  try {
    const products = await productModel.find({ seller: seller._id });
    res.status(200).json({
      message: "product fetched succesfully",
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
