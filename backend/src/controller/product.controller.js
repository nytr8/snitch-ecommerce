import productModel from "../model/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const seller = req.user;
  try {
    const { title, description, price } = req.body;
    const images = await Promise.all(
      req.files.map(async (file) => {
        await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );
    const product = await productModel.create({
      title,
      description,
      price: {
        amount: price,
        currency: "INR",
      },
      images,
      seller: seller.id,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
