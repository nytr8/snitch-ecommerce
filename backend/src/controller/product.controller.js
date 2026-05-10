import productModel from "../model/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const seller = req.user;
  const { title, description, priceAmount, priceCurrency, category } = req.body;
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
      category,
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

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("seller", "name email");
    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel
      .findById(productId)
      .populate("seller", "name email");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const seller = req.user;
  try {
    const product = await productModel.findOne({
      _id: productId,
      seller: seller._id,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }
    await productModel.deleteOne({ _id: productId });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addProductVariant = async (req, res) => {
  const { productId } = req.params;
  const seller = req.user._id;
  const { color, stock, priceAmount, priceCurrency, name, values } = req.body;
  try {
    const product = await productModel.findOne({
      _id: productId,
      seller,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }
    const images = await Promise.all(
      req.files.map(async (file) => {
        const res = await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: res.url };
      }),
    );
    const variant = {
      attributes: {
        name,
        values,
      },
      color,
      stock,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
    };
    product.variants.push(variant);
    await product.save();
    res.status(200).json({ message: "Variant added successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
