import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../products/services/product.api";

const ProductImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex =
    images.length === 0 ? 0 : Math.min(activeIndex, images.length - 1);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
        Image Missing
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={images[safeIndex].url}
          alt={`${title} ${safeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`aspect-square overflow-hidden border ${
                index === safeIndex ? "border-black" : "border-gray-200"
              }`}
              aria-label={`View ${title} image ${index + 1}`}
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

const UserProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedAttributeValue, setSelectedAttributeValue] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getProductById(id);
        setProduct(response?.product || null);
      } catch (loadError) {
        setError(loadError?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductDetails();
    }
  }, [id]);

  const variants = useMemo(() => {
    if (!Array.isArray(product?.variants)) {
      return [];
    }
    return product.variants;
  }, [product]);

  const availableColors = useMemo(() => {
    const colors = variants.map((variant) => variant?.color).filter(Boolean);
    return [...new Set(colors)];
  }, [variants]);

  const normalizedSelectedColor = useMemo(() => {
    if (availableColors.length === 0) return "";
    return availableColors.includes(selectedColor)
      ? selectedColor
      : availableColors[0];
  }, [availableColors, selectedColor]);

  const variantsForSelectedColor = useMemo(() => {
    if (variants.length === 0) return [];
    if (!normalizedSelectedColor) return variants;
    return variants.filter((variant) => variant?.color === normalizedSelectedColor);
  }, [variants, normalizedSelectedColor]);

  const attributeName = useMemo(() => {
    return (
      variantsForSelectedColor[0]?.attributes?.name ||
      variants[0]?.attributes?.name ||
      "Size"
    );
  }, [variantsForSelectedColor, variants]);

  const availableAttributeValues = useMemo(() => {
    const rawValues = variantsForSelectedColor.flatMap((variant) => {
      if (!Array.isArray(variant?.attributes?.values)) {
        return [];
      }
      return variant.attributes.values.filter(Boolean);
    });

    return [...new Set(rawValues)];
  }, [variantsForSelectedColor]);

  const normalizedSelectedAttribute = useMemo(() => {
    if (availableAttributeValues.length === 0) return "";
    return availableAttributeValues.includes(selectedAttributeValue)
      ? selectedAttributeValue
      : availableAttributeValues[0];
  }, [availableAttributeValues, selectedAttributeValue]);

  const selectedVariant = useMemo(() => {
    if (variantsForSelectedColor.length === 0) {
      return variants[0] || null;
    }

    if (!normalizedSelectedAttribute) {
      return variantsForSelectedColor[0];
    }

    const matchedVariant = variantsForSelectedColor.find((variant) => {
      if (!Array.isArray(variant?.attributes?.values)) {
        return false;
      }
      return variant.attributes.values.includes(normalizedSelectedAttribute);
    });

    return matchedVariant || variantsForSelectedColor[0];
  }, [variants, variantsForSelectedColor, normalizedSelectedAttribute]);

  const displayedImages = useMemo(() => {
    const variantImages = Array.isArray(selectedVariant?.images)
      ? selectedVariant.images.filter((image) => image?.url)
      : [];
    const productImages = Array.isArray(product?.images)
      ? product.images.filter((image) => image?.url)
      : [];
    return variantImages.length > 0 ? variantImages : productImages;
  }, [product, selectedVariant]);

  const displayPrice = selectedVariant?.price?.amount ?? product?.price?.amount;
  const displayCurrency =
    selectedVariant?.price?.currency ?? product?.price?.currency ?? "INR";
  const displayStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const normalizedQuantity =
    displayStock <= 0 ? 0 : Math.min(Math.max(quantity, 1), displayStock);

  const handleColorSelect = (color) => {
    setSelectedColor(color);

    const colorVariants = variants.filter((variant) => variant?.color === color);
    const colorValues = [
      ...new Set(
        colorVariants.flatMap((variant) =>
          Array.isArray(variant?.attributes?.values)
            ? variant.attributes.values.filter(Boolean)
            : [],
        ),
      ),
    ];

    const nextAttribute = colorValues[0] || "";
    setSelectedAttributeValue(nextAttribute);

    const nextVariant =
      colorVariants.find((variant) =>
        Array.isArray(variant?.attributes?.values)
          ? variant.attributes.values.includes(nextAttribute)
          : false,
      ) || colorVariants[0];
    const nextStock = Number(nextVariant?.stock) || 0;
    setQuantity(nextStock > 0 ? 1 : 0);
  };

  const handleAttributeSelect = (value) => {
    setSelectedAttributeValue(value);

    const nextVariant =
      variantsForSelectedColor.find((variant) =>
        Array.isArray(variant?.attributes?.values)
          ? variant.attributes.values.includes(value)
          : false,
      ) || variantsForSelectedColor[0];
    const nextStock = Number(nextVariant?.stock) || 0;
    setQuantity(nextStock > 0 ? 1 : 0);
  };

  const increaseQuantity = () => {
    if (displayStock <= 0) return;
    setQuantity((current) =>
      Math.min(Math.max(current, 1) + 1, displayStock),
    );
  };

  const decreaseQuantity = () => {
    if (displayStock <= 0) return;
    setQuantity((current) =>
      Math.max(Math.max(current, 1) - 1, 1),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] px-6 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] px-6 py-24">
        <div className="mx-auto max-w-5xl border border-red-200 bg-red-50 px-6 py-4 text-xs font-bold tracking-wider text-red-600 uppercase">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] px-6 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-[#1A1A1A]">
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-[#FCFBFA]/90 px-6 py-5 backdrop-blur-xl sm:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
          <Link
            to="/"
            className="display-font text-3xl font-bold tracking-tighter uppercase"
          >
            Snitch
          </Link>
          <Link
            to="/"
            className="text-[11px] font-bold tracking-[0.3em] text-gray-500 uppercase transition hover:text-black"
          >
            Back To Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[1600px] px-6 py-10 sm:px-12 sm:py-14">
        <div className="mb-8 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
          {product.category || "General"} / Product Details
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.1fr_1fr]">
          <ProductImageGallery
            key={normalizedSelectedColor || "default-color"}
            images={displayedImages}
            title={product.title}
          />

          <div className="space-y-8">
            <div>
              <h1 className="display-font text-4xl leading-tight font-bold tracking-tight uppercase sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 text-3xl font-bold">
                {displayPrice}{" "}
                <span className="text-sm font-normal tracking-[0.25em] text-gray-400 uppercase">
                  {displayCurrency}
                </span>
              </p>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            <div className="space-y-4 border-y border-gray-200 py-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                  Availability:
                </span>
                <span
                  className={`px-2 py-1 text-[10px] font-bold tracking-[0.2em] uppercase ${
                    displayStock > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {displayStock > 0 ? `In Stock (${displayStock})` : "Out of Stock"}
                </span>
              </div>

              {availableAttributeValues.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                    {attributeName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableAttributeValues.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAttributeSelect(value)}
                        className={`min-w-12 border px-3 py-2 text-xs font-bold uppercase transition ${
                          value === normalizedSelectedAttribute
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-black"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {availableColors.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                    Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`border px-3 py-2 text-[10px] font-bold tracking-[0.22em] uppercase transition ${
                          color === normalizedSelectedColor
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-gray-300">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="h-11 w-11 border-r border-gray-300 text-lg font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={displayStock === 0 || normalizedQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="inline-flex h-11 min-w-14 items-center justify-center text-sm font-semibold">
                    {normalizedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="h-11 w-11 border-l border-gray-300 text-lg font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={displayStock === 0 || normalizedQuantity >= displayStock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={displayStock === 0}
                onClick={() => alert("Cart integration coming soon")}
                className="w-full border border-black bg-black px-6 py-4 text-[11px] font-bold tracking-[0.3em] text-white uppercase transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-500"
              >
                Add To Cart
              </button>
              <button
                type="button"
                disabled={displayStock === 0}
                onClick={() => alert("Checkout integration coming soon")}
                className="w-full border border-black px-6 py-4 text-[11px] font-bold tracking-[0.3em] uppercase transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                Buy Now
              </button>
            </div>

            <div className="space-y-2 border border-gray-200 p-5">
              <h3 className="text-[11px] font-bold tracking-[0.3em] text-gray-500 uppercase">
                Product Highlights
              </h3>
              <p className="text-sm text-gray-600">
                Premium construction, detailed finishing, and curated fit crafted
                for everyday elevated wear.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProductDetails;
