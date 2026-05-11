import productModel from "../model/product.model";

export const stockOfvarient = async (productId, variantId) => {
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });
  if (!product) {
    throw new Error("Product or variant not found");
  }
  const stock = product.variants.find(
    (variant) => variant._id.toString() === variantId,
  ).stock;
  return stock;
};
