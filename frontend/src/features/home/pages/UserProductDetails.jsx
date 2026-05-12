import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../products/services/product.api";
import { useCart } from "../../cart/hook/useCart";

const cleanText = (value) =>
  typeof value === "string" ? value.trim() : String(value || "").trim();

const normalizeForMatch = (value) => cleanText(value).toLowerCase();

const getVariantAttributeValues = (variant) => {
  const rawValues = variant?.attributes?.values;
  const valuesArray = Array.isArray(rawValues)
    ? rawValues
    : rawValues === null || rawValues === undefined
      ? []
      : [rawValues];

  return valuesArray.map((value) => cleanText(value)).filter(Boolean);
};

const ProductImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex =
    images.length === 0 ? 0 : Math.min(activeIndex, images.length - 1);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-gray-100 bg-gray-50 label-sm text-gray-300 rounded-default italic">
        Image Missing
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-default border border-gray-100 bg-gray-50">
        <img
          src={images[safeIndex].url}
          alt={`${title} ${safeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-6 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`aspect-square overflow-hidden rounded-default border transition-all ${
                index === safeIndex
                  ? "border-black scale-95"
                  : "border-transparent opacity-60 hover:opacity-100"
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
  const { handleAddToCart } = useCart();

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
    const uniqueColors = [];
    const seenColorKeys = new Set();

    variants.forEach((variant) => {
      const color = cleanText(variant?.color);
      const colorKey = normalizeForMatch(color);
      if (!colorKey || seenColorKeys.has(colorKey)) {
        return;
      }
      seenColorKeys.add(colorKey);
      uniqueColors.push({
        name: color,
        thumbnail: variant?.images?.[0]?.url || product?.images?.[0]?.url,
      });
    });

    return uniqueColors;
  }, [variants, product]);

  const normalizedSelectedColor = useMemo(() => {
    if (availableColors.length === 0) return "";
    const selectedColorKey = normalizeForMatch(selectedColor);
    const found = availableColors.find(
      (colorOption) => normalizeForMatch(colorOption.name) === selectedColorKey,
    );
    return found ? found.name : availableColors[0].name;
  }, [availableColors, selectedColor]);

  const variantsForSelectedColor = useMemo(() => {
    if (variants.length === 0) return [];
    if (!normalizedSelectedColor) return variants;
    const selectedColorKey = normalizeForMatch(normalizedSelectedColor);
    return variants.filter(
      (variant) => normalizeForMatch(variant?.color) === selectedColorKey,
    );
  }, [variants, normalizedSelectedColor]);


  const attributeName = useMemo(() => {
    return (
      variantsForSelectedColor[0]?.attributes?.name ||
      variants[0]?.attributes?.name ||
      "Size"
    );
  }, [variantsForSelectedColor, variants]);

  const availableAttributeValues = useMemo(() => {
    const uniqueValues = [];
    const seenValueKeys = new Set();

    variantsForSelectedColor.forEach((variant) => {
      getVariantAttributeValues(variant).forEach((value) => {
        const valueKey = normalizeForMatch(value);
        if (!valueKey || seenValueKeys.has(valueKey)) {
          return;
        }
        seenValueKeys.add(valueKey);
        uniqueValues.push(value);
      });
    });

    return uniqueValues;
  }, [variantsForSelectedColor]);

  const normalizedSelectedAttribute = useMemo(() => {
    if (availableAttributeValues.length === 0) return "";
    const selectedAttributeKey = normalizeForMatch(selectedAttributeValue);
    return (
      availableAttributeValues.find(
        (attributeOption) =>
          normalizeForMatch(attributeOption) === selectedAttributeKey,
      ) || availableAttributeValues[0]
    );
  }, [availableAttributeValues, selectedAttributeValue]);

  const selectedVariant = useMemo(() => {
    if (variantsForSelectedColor.length === 0) {
      return variants[0] || null;
    }

    if (!normalizedSelectedAttribute) {
      return variantsForSelectedColor[0];
    }

    const matchedVariant = variantsForSelectedColor.find((variant) => {
      const variantAttributeKeys = getVariantAttributeValues(variant).map(
        (value) => normalizeForMatch(value),
      );
      return variantAttributeKeys.includes(
        normalizeForMatch(normalizedSelectedAttribute),
      );
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

    const selectedColorKey = normalizeForMatch(color);
    const colorVariants = variants.filter(
      (variant) => normalizeForMatch(variant?.color) === selectedColorKey,
    );
    const colorValues = [
      ...new Set(
        colorVariants.flatMap((variant) => getVariantAttributeValues(variant)),
      ),
    ];

    const currentAttributeKey = normalizeForMatch(selectedAttributeValue);
    const nextAttribute =
      colorValues.find(
        (value) => normalizeForMatch(value) === currentAttributeKey,
      ) ||
      colorValues[0] ||
      "";
    setSelectedAttributeValue(nextAttribute);

    const nextVariant =
      colorVariants.find((variant) =>
        getVariantAttributeValues(variant)
          .map((value) => normalizeForMatch(value))
          .includes(normalizeForMatch(nextAttribute)),
      ) || colorVariants[0];
    const nextStock = Number(nextVariant?.stock) || 0;
    setQuantity(nextStock > 0 ? 1 : 0);
  };

  const handleAttributeSelect = (value) => {
    setSelectedAttributeValue(value);

    const nextVariant =
      variantsForSelectedColor.find((variant) =>
        getVariantAttributeValues(variant)
          .map((attributeValue) => normalizeForMatch(attributeValue))
          .includes(normalizeForMatch(value)),
      ) || variantsForSelectedColor[0];
    const nextStock = Number(nextVariant?.stock) || 0;
    setQuantity(nextStock > 0 ? 1 : 0);
  };

  const increaseQuantity = () => {
    if (displayStock <= 0) return;
    setQuantity((current) => Math.min(Math.max(current, 1) + 1, displayStock));
  };

  const decreaseQuantity = () => {
    if (displayStock <= 0) return;
    setQuantity((current) => Math.max(Math.max(current, 1) - 1, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-24 text-center label-sm text-secondary lowercase italic">
        Retrieving Studio Piece...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-edge py-24">
        <div className="mx-auto max-w-5xl border border-red-50 bg-red-50/30 px-6 py-4 label-sm text-red-600 lowercase italic">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background px-6 py-24 text-center label-sm text-secondary italic">
        Piece not found in collection.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <nav className="nav-blur border-b border-gray-100 px-edge py-8 flex items-center justify-between">
        <Link
          to="/"
          className="display-font text-4xl font-bold tracking-tighter uppercase"
        >
          Snitch
        </Link>
        <Link
          to="/"
          className="label-sm mb-0 text-secondary hover:text-black transition-colors italic"
        >
          Back to Archive
        </Link>
      </nav>

      <main className="max-w-[1600px] mx-auto px-edge py-16">
        <div className="label-sm text-secondary mb-12 lowercase italic fade-up">
          {product.category || "General"} / Archival Details
        </div>

        <div className="grid grid-cols-1 gap-24 xl:grid-cols-[1.1fr_1fr] fade-up">
          <ProductImageGallery
            key={
              selectedVariant?._id || normalizedSelectedColor || "default-color"
            }
            images={displayedImages}
            title={product.title}
          />

          <div className="space-y-12">
            <div>
              <h1 className="display-font text-5xl leading-[0.95] font-bold tracking-tight uppercase sm:text-7xl mb-8">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-4">
                <p className="display-font text-4xl font-bold">
                  {displayPrice}
                </p>
                <span className="label-sm mb-0 text-secondary lowercase italic">
                  {displayCurrency} / tax incl.
                </span>
              </div>
            </div>

            <p className="text-xl leading-relaxed text-secondary italic">
              "{product.description}"
            </p>

            <div className="space-y-10 border-y border-gray-50 py-12">
              <div className="flex items-center gap-4">
                <span className="label-sm mb-0">Availability:</span>
                <span
                  className={`label-sm mb-0 lowercase italic ${displayStock > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {displayStock > 0
                    ? `In Stock / ${displayStock} available`
                    : "Sold Out"}
                </span>
              </div>

              {availableAttributeValues.length > 0 && (
                <div className="space-y-6">
                  <p className="label-sm mb-0">{attributeName}</p>
                  <div className="flex flex-wrap gap-3">
                    {availableAttributeValues.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAttributeSelect(value)}
                        className={`min-w-16 px-6 py-3 rounded-default transition-all ${
                          value === normalizedSelectedAttribute
                            ? "bg-black text-white"
                            : "label-sm mb-0 bg-white border border-gray-100 hover:border-black"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <p className="label-sm mb-0">Palette</p>
                    <p className="label-xs text-secondary lowercase italic">{normalizedSelectedColor}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        className={`group relative w-16 aspect-[3/4] rounded-default overflow-hidden border-2 transition-all ${
                          color.name === normalizedSelectedColor
                            ? "border-black scale-105"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        title={color.name}
                      >
                        <img 
                          src={color.thumbnail} 
                          alt={color.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-black/5 transition-opacity ${color.name === normalizedSelectedColor ? 'opacity-0' : 'group-hover:opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <p className="label-sm mb-0">Quantity</p>
                <div className="inline-flex items-center border border-gray-100 rounded-full px-6 py-2">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="label-sm mb-0 h-10 w-10 flex items-center justify-center disabled:opacity-30"
                    disabled={displayStock === 0 || normalizedQuantity <= 1}
                  >
                    —
                  </button>
                  <span className="label-sm mb-0 min-w-12 text-center text-lg">
                    {normalizedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="label-sm mb-0 h-10 w-10 flex items-center justify-center disabled:opacity-30"
                    disabled={
                      displayStock === 0 || normalizedQuantity >= displayStock
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-2 p-6 bg-gray-50/50 rounded-default border border-gray-100">
                <p className="label-xs text-gray-400 uppercase tracking-widest">Currently Selected</p>
                <p className="label-sm mb-0 text-black">
                  {normalizedSelectedColor} / {normalizedSelectedAttribute} ({normalizedQuantity} piece{normalizedQuantity !== 1 ? 's' : ''})
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() =>
                    handleAddToCart({
                      productId: product._id,
                      variantId: selectedVariant?._id,
                      quantity: normalizedQuantity,
                      selectedAttribute: normalizedSelectedAttribute,
                    })

                  }
                  type="button"
                  disabled={displayStock === 0}
                  className="btn-primary w-full py-6 text-sm uppercase tracking-widest"
                >
                  {displayStock > 0 ? "Add to Bag" : "Currently Unavailable"}
                </button>
                <button
                  type="button"
                  disabled={displayStock === 0}
                  onClick={() => alert("Proceeding to Private Checkout")}
                  className="btn-outline w-full py-6 text-sm uppercase tracking-widest"
                >
                  Buy Now
                </button>
              </div>
            </div>


            <div className="surface-card p-10 bg-gray-50/50 border-none">
              <h3 className="label-sm mb-4 text-black lowercase italic underline underline-offset-8">
                Studio Highlights
              </h3>
              <p className="text-secondary italic leading-relaxed text-sm">
                Architectural construction, precision tailoring, and
                limited-edition materials curated for a refined silhouette.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProductDetails;
