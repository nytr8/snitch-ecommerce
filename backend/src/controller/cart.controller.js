import mongoose from "mongoose";
import { stockOfvarient } from "../dao/product.dao.js";
import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/aggrigation.dao.js";
import paymentModel from "../model/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
const normalizeVariantId = (id) => {
  if (!id || id === "null" || id === "undefined") return null;
  return id;
};

const populateCart = async (cartId) => {
  const cart = await cartModel.findById(cartId).populate("items.product");

  if (!cart) return null;

  const cartObj = cart.toObject();
  cartObj.items = cartObj.items.map((item) => {
    if (item.product && item.variant) {
      const variantDetails = item.product.variants.find(
        (v) => v._id.toString() === item.variant.toString(),
      );
      return { ...item, variant: variantDetails };
    }
    return item;
  });
  return cartObj;
};

export const addToCart = async (req, res) => {
  const productId = req.params.productId;
  const variantId = normalizeVariantId(req.params.variantId);
  const { quantity, selectedAttribute } = req.body;

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let stock;
    let price;

    if (variantId) {
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId,
      );
      if (!variant) {
        return res
          .status(404)
          .json({ success: false, message: "Variant not found" });
      }
      stock = variant.stock;
      price = variant.price;
    } else {
      stock = product.quantity;
      price = product.price;
    }

    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = await cartModel.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (variantId ? item.variant?.toString() === variantId : !item.variant) &&
        item.selectedAttribute === selectedAttribute,
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${stock} units available in total`,
        });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      if (quantity > stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${stock} units available`,
        });
      }
      cart.items.push({
        product: productId,
        variant: variantId || undefined,
        selectedAttribute,
        quantity,
        price,
      });
    }

    await cart.save();
    const populatedCart = await populateCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const productId = req.params.productId;
  const variantId = normalizeVariantId(req.params.variantId);
  const { selectedAttribute } = req.query;

  try {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          (variantId
            ? item.variant?.toString() === variantId
            : !item.variant) &&
          (selectedAttribute
            ? item.selectedAttribute === selectedAttribute
            : true)
        ),
    );

    await cart.save();

    const populatedCart = await populateCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const productId = req.params.productId;
  const variantId = normalizeVariantId(req.params.variantId);
  const { quantity, selectedAttribute } = req.body;

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let stock;
    if (variantId) {
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId,
      );
      stock = variant ? variant.stock : 0;
    } else {
      stock = product.quantity;
    }

    if (quantity > stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${stock} units available`,
      });
    }

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (variantId ? item.variant?.toString() === variantId : !item.variant) &&
        item.selectedAttribute === selectedAttribute,
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const populatedCart = await populateCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await getCartDetails(req.user._id);
    if (!cart) {
      cart = await cartModel.create({ user: req.user._id, items: [] });
    }

    const populatedCart = await populateCart(cart._id);

    res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrderController = async (req, res) => {
  const cart = await getCartDetails(req.user._id);
  if (!cart) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }
  const order = await createOrder({
    amount: cart.totalPrice,
    currency: cart.currency,
  });
  const payment = await paymentModel.create({
    user: req.user._id,
    razorpay: {
      orderId: order._id,
    },
    price: {
      amount: cart.totalPrice,
      currency: cart.currency,
    },
    orderItems: cart.items.map((item) => ({
      title: item.product.title,
      productId: item.product._id,
      variantId: item.variant,
      quantity: item.quantity,
      images: item.product.variants.images || item.product.images,
      description: item.product.description,
      price: {
        amount: item.product.variants.price.amount || item.product.price.amount,
        currency:
          item.product.variants.price.currency || item.product.price.currency,
      },
    })),
  });
  return res
    .status(200)
    .json({ message: "Order created successfully", success: true, order });
};

export const verifyOrderController = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const payment = await paymentModel.findOne({
    "razorpay.orderId": razorpay_order_id,
    status: "pending",
  });
  if (!payment) {
    return res.status(400).json({
      message: "payment not found",
      success: false,
    });
  }
  const isPaymentValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    config.RAZORPAY_KEY_SECRET,
  );
  if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({
      message: "payment verification failed",
      success: false,
    });
  }

  payment.status = "paid";
  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;

  await payment.save();

  return res.status(200).json({
    message: "payment verification succesfull",
    success: true,
  });
};
