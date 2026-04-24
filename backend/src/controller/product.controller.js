import productModel from "../model/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, images, seller } = req.body;
    const product = await productModel.create({
      name: title,
      description,
      price,
      images,
      seller,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
