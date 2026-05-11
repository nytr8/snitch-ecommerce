import cartModel from "../model/cart.model";
import productModel from "../model/product.model";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity } = req.body;
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product or variant not found",
    });
  }
  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant.toString() === variantId,
  );
  if (isProductInCart) {
    const qntyInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    ).quantity;
    if (qntyInCart + quantity > stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${stock} units available`,
      });
    }
    await cartModel.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          items: {
            product: productId,
            variant: variantId,
            quantity,
            price: product.variants.find(
              (variant) => variant._id.toString() === variantId,
            ).price,
          },
        },
      },
      { new: true, upsert: true },
    );
  }
  if (quantity > stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${stock} units available`,
    });
  }
  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.variants.find(
      (variant) => variant._id.toString() === variantId,
    ).price,
  });
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart,
  });
};

export const getCart = async (req, res) => {
  const cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("items.product")
    .populate("items.variant");
  if (!cart) {
    cart = await cartModel.create({ user: req.user._id });
  }
  res.status(200).json({
    success: true,
    cart,
  });
};
