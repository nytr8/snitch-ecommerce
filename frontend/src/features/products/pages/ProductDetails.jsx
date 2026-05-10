import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useProduct from "../hooks/useProduct";
import SellerLayout from "../components/SellerLayout";

const ProductImageCarousel = ({ images, title, carouselKey }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const safeActiveImageIndex =
    images.length === 0 ? 0 : Math.min(activeImageIndex, images.length - 1);

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div key={carouselKey} className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden border border-gray-100 bg-gray-50">
        {images.length > 0 ? (
          <>
            <img
              src={images[safeActiveImageIndex]?.url}
              alt={`${title} ${safeActiveImageIndex + 1}`}
              className="h-full w-full object-cover"
            />
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/50 bg-black/40 text-xl font-semibold text-white transition hover:bg-black/60"
                  aria-label="Previous image"
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/50 bg-black/40 text-xl font-semibold text-white transition hover:bg-black/60"
                  aria-label="Next image"
                >
                  &#8250;
                </button>
                <div className="absolute right-3 bottom-3 bg-black/60 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                  {safeActiveImageIndex + 1} / {images.length}
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] tracking-widest text-gray-300 uppercase">
            Image Missing
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`aspect-square overflow-hidden border ${
                index === safeActiveImageIndex ? "border-black" : "border-gray-200"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { handleProductDetails, handleAddProductVariant } = useProduct();
  const productDetails = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const [variantForm, setVariantForm] = useState({
    attributeName: "",
    attributeValues: "",
    color: "",
    stock: "",
    amount: "",
    currency: "INR",
  });
  const [variantImages, setVariantImages] = useState([]);
  const [variantPreviewUrls, setVariantPreviewUrls] = useState([]);
  const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
  const variantPreviewUrlsRef = useRef([]);

  const productImages = useMemo(() => {
    if (!productDetails?.images || !Array.isArray(productDetails.images)) {
      return [];
    }
    return productDetails.images.filter((image) => image?.url);
  }, [productDetails]);

  const productVariants = useMemo(() => {
    if (!Array.isArray(productDetails?.variants)) {
      return [];
    }
    return productDetails.variants;
  }, [productDetails]);

  const carouselKey = productDetails?._id || id;

  useEffect(() => {
    if (id) {
      handleProductDetails(id);
    }
  }, [id, handleProductDetails]);

  useEffect(() => {
    variantPreviewUrlsRef.current = variantPreviewUrls;
  }, [variantPreviewUrls]);

  useEffect(() => {
    return () => {
      variantPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleVariantInputChange = (event) => {
    const { name, value } = event.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 7 - variantImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      return;
    }

    setVariantImages((prev) => [...prev, ...filesToAdd]);
    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file));
    setVariantPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    event.target.value = "";
  };

  const removeVariantImage = (index) => {
    const imageToRemove = variantPreviewUrls[index];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove);
    }
    setVariantImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
    setVariantPreviewUrls((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const resetVariantForm = () => {
    variantPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setVariantForm({
      attributeName: "",
      attributeValues: "",
      color: "",
      stock: "",
      amount: "",
      currency: "INR",
    });
    setVariantImages([]);
    setVariantPreviewUrls([]);
  };

  const handleVariantSubmit = async (event) => {
    event.preventDefault();

    if (!variantForm.attributeName.trim()) {
      alert("Please enter an attribute name (for example: Size).");
      return;
    }

    if (!variantForm.attributeValues.trim()) {
      alert("Please enter at least one attribute value.");
      return;
    }

    if (!variantForm.color.trim()) {
      alert("Please enter a variant color.");
      return;
    }

    if (variantForm.stock === "" || Number(variantForm.stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (!variantForm.amount || Number(variantForm.amount) <= 0) {
      alert("Please enter a valid variant price.");
      return;
    }

    if (variantImages.length === 0) {
      alert("Please upload at least one variant image.");
      return;
    }

    setIsSubmittingVariant(true);
    try {
      const parsedValues = variantForm.attributeValues
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      if (parsedValues.length === 0) {
        alert("Please enter valid attribute values.");
        return;
      }

      const formData = new FormData();
      formData.append("name", variantForm.attributeName.trim());
      parsedValues.forEach((value) => formData.append("values", value));
      formData.append("color", variantForm.color.trim());
      formData.append("stock", Number(variantForm.stock));
      formData.append("priceAmount", Number(variantForm.amount));
      formData.append("priceCurrency", variantForm.currency);

      variantImages.forEach((image) => {
        formData.append("images", image);
      });

      const result = await handleAddProductVariant(id, formData);
      if (!result.success) {
        throw new Error(result.message || "Failed to add variant");
      }

      alert("Variant added successfully!");
      resetVariantForm();
    } catch (submitError) {
      console.error("Error adding product variant:", submitError);
      alert("Failed to add variant. Please try again.");
    } finally {
      setIsSubmittingVariant(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout title="Product Details" subtitle="Loading...">
        <div className="border border-dashed border-gray-200 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
          Loading product details...
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout title="Product Details" subtitle="Error">
        <div className="border border-red-200 bg-red-50 px-6 py-4 text-xs font-bold tracking-wider text-red-600 uppercase">
          {error}
        </div>
      </SellerLayout>
    );
  }

  if (!productDetails) {
    return (
      <SellerLayout title="Product Details" subtitle="Not Found">
        <div className="border border-dashed border-gray-200 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
          Product not found.
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout
      title="Product Details"
      subtitle={productDetails.title}
      ctaLabel="Edit Product"
      ctaLink={`/seller/edit-product/${id}`}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImageCarousel
          images={productImages}
          title={productDetails.title}
          carouselKey={carouselKey}
        />
        <div className="space-y-6">
          <h3 className="display-font text-3xl font-bold tracking-tight uppercase">
            {productDetails.title}
          </h3>
          <p className="display-font text-2xl font-bold">
            {productDetails.price?.amount}{" "}
            <span className="text-sm font-normal tracking-widest text-gray-400 uppercase">
              {productDetails.price?.currency}
            </span>
          </p>
          <p className="text-sm text-gray-600">{productDetails.description}</p>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Category: {productDetails.category}
            </p>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Stock: {productDetails.stock}
            </p>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Variants: {productVariants.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 xl:grid-cols-2">
        <div className="space-y-6 border border-gray-200 p-6">
          <h4 className="display-font text-2xl font-bold tracking-tight uppercase">
            Add Product Variant
          </h4>
          <form onSubmit={handleVariantSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Attribute Name
                </label>
                <input
                  type="text"
                  name="attributeName"
                  value={variantForm.attributeName}
                  onChange={handleVariantInputChange}
                  placeholder="e.g. Size"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Attribute Values
                </label>
                <input
                  type="text"
                  name="attributeValues"
                  value={variantForm.attributeValues}
                  onChange={handleVariantInputChange}
                  placeholder="e.g. M, L, XL"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={variantForm.color}
                  onChange={handleVariantInputChange}
                  placeholder="e.g. Black"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={variantForm.stock}
                  onChange={handleVariantInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Price
                </label>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={variantForm.amount}
                  onChange={handleVariantInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Currency
                </label>
                <select
                  name="currency"
                  value={variantForm.currency}
                  onChange={handleVariantInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CNY">CNY</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                Variant Images ({variantImages.length}/7)
              </label>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {Array.from({ length: 7 }).map((_, index) => (
                  <label
                    key={index}
                    className={`relative flex aspect-square cursor-pointer items-center justify-center border ${
                      variantPreviewUrls[index]
                        ? "border-gray-300 bg-gray-50"
                        : "border-dashed border-gray-300 hover:border-black"
                    }`}
                  >
                    {variantPreviewUrls[index] ? (
                      <>
                        <img
                          src={variantPreviewUrls[index]}
                          alt={`Variant preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            removeVariantImage(index);
                          }}
                          className="absolute inset-0 bg-black/50 text-xs font-semibold tracking-wider text-white opacity-0 transition hover:opacity-100"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="text-lg font-light text-gray-400">+</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleVariantImageUpload}
                      disabled={variantImages.length >= 7}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmittingVariant}
                className={`border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase transition ${
                  isSubmittingVariant
                    ? "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500"
                    : "border-black bg-black text-white hover:bg-white hover:text-black"
                }`}
              >
                {isSubmittingVariant ? "Adding..." : "Add Variant"}
              </button>
              <button
                type="button"
                onClick={resetVariantForm}
                className="border border-gray-300 px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase transition hover:border-black"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <h4 className="display-font text-2xl font-bold tracking-tight uppercase">
            Existing Variants
          </h4>
          {productVariants.length > 0 ? (
            <div className="space-y-8">
              {productVariants.map((variant, index) => {
                const variantImagesList = Array.isArray(variant.images)
                  ? variant.images.filter((image) => image?.url)
                  : [];
                const attributeName = variant.attributes?.name || "Attribute";
                const attributeValues = Array.isArray(variant.attributes?.values)
                  ? variant.attributes.values.filter(Boolean)
                  : variant.attributes?.values
                    ? [variant.attributes.values]
                    : [];
                return (
                  <div
                    key={variant._id || `${attributeName}-${variant.color || "color"}-${index}`}
                    className="border border-gray-200 p-5"
                  >
                    <div className="mb-4 flex flex-wrap gap-3">
                      <span className="bg-gray-100 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                        {attributeName}:{" "}
                        {attributeValues.length > 0
                          ? attributeValues.join(", ")
                          : "N/A"}
                      </span>
                      <span className="bg-gray-100 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                        {variant.color}
                      </span>
                      <span className="bg-gray-100 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                        Stock: {variant.stock ?? 0}
                      </span>
                      <span className="bg-gray-100 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                        {variant.price?.amount} {variant.price?.currency}
                      </span>
                    </div>
                    <ProductImageCarousel
                      images={variantImagesList}
                      title={`${productDetails.title} ${attributeName} ${attributeValues.join(" ")} ${variant.color}`}
                      carouselKey={variant._id || `${productDetails._id}-variant-${index}`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 py-16 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              No variants added yet.
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default ProductDetails;
