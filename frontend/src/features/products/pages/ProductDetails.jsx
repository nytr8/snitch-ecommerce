import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
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
    <div key={carouselKey} className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-default border border-gray-100 bg-gray-50">
        {images.length > 0 ? (
          <>
            <img
              src={images[safeActiveImageIndex]?.url}
              alt={`${title} ${safeActiveImageIndex + 1}`}
              className="h-full w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm label-sm mb-0 text-black"
                  >
                    —
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm label-sm mb-0 text-black"
                  >
                    +
                  </button>
                </div>
                <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur-md px-3 py-1 label-sm mb-0 text-[8px] rounded-full">
                  {safeActiveImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center label-sm text-gray-300 italic">
            Image Missing
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-default border transition-all ${
                index === safeActiveImageIndex ? "border-black" : "border-transparent opacity-60"
              }`}
            >
              <img
                src={image.url}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { handleProductDetails, handleAddProductVariant } = useProduct();
  const productDetails = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  
  const [showVariantForm, setShowVariantForm] = useState(false);
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
    return productDetails?.images?.filter((image) => image?.url) || [];
  }, [productDetails]);

  const productVariants = useMemo(() => {
    return productDetails?.variants || [];
  }, [productDetails]);

  useEffect(() => {
    if (id) handleProductDetails(id);
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
    setVariantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 7 - variantImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    setVariantImages((prev) => [...prev, ...filesToAdd]);
    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file));
    setVariantPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    event.target.value = "";
  };

  const removeVariantImage = (index) => {
    const imageToRemove = variantPreviewUrls[index];
    if (imageToRemove) URL.revokeObjectURL(imageToRemove);
    setVariantImages((prev) => prev.filter((_, i) => i !== index));
    setVariantPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
    setShowVariantForm(false);
  };

  const handleVariantSubmit = async (event) => {
    event.preventDefault();
    if (!variantForm.attributeName.trim() || !variantForm.attributeValues.trim() || !variantForm.color.trim() || !variantForm.stock || !variantForm.amount || variantImages.length === 0) {
      alert("Please complete all variant details and upload images.");
      return;
    }

    setIsSubmittingVariant(true);
    try {
      const parsedValues = variantForm.attributeValues.split(",").map(v => v.trim()).filter(Boolean);
      const formData = new FormData();
      formData.append("name", variantForm.attributeName.trim());
      parsedValues.forEach(v => formData.append("values", v));
      formData.append("color", variantForm.color.trim());
      formData.append("stock", Number(variantForm.stock));
      formData.append("priceAmount", Number(variantForm.amount));
      formData.append("priceCurrency", variantForm.currency);
      variantImages.forEach(img => formData.append("images", img));

      const result = await handleAddProductVariant(id, formData);
      if (result.success) {
        alert("Variant added successfully!");
        resetVariantForm();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert("Failed to add variant. Please try again.");
    } finally {
      setIsSubmittingVariant(false);
    }
  };

  if (loading) return <SellerLayout title="Piece Details" subtitle="Retrieving Archive..."><div className="py-24 text-center label-sm text-secondary italic">Loading...</div></SellerLayout>;
  if (error) return <SellerLayout title="Piece Details" subtitle="Error"><div className="label-sm text-red-500 p-8">{error}</div></SellerLayout>;
  if (!productDetails) return <SellerLayout title="Piece Details" subtitle="Not Found"><div className="py-24 text-center label-sm text-secondary italic">Piece not found.</div></SellerLayout>;

  return (
    <SellerLayout
      title="Piece Details"
      subtitle={productDetails.title}
      ctaLabel="Edit Core Details"
      ctaLink={`/seller/edit-product/${id}`}
      extraActions={[
        {
          label: showVariantForm ? "Cancel Add" : "Add Variant",
          variant: "outline",
          onClick: () => setShowVariantForm(!showVariantForm)
        }
      ]}
    >
      <div className="relative">
        <div className={`space-y-32 transition-all duration-700 ${showVariantForm ? 'blur-md opacity-30 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 fade-up">
            <ProductImageCarousel images={productImages} title={productDetails.title} carouselKey={productDetails._id} />
            <div className="space-y-10">
              <div>
                <p className="label-sm text-secondary mb-4 italic lowercase">{productDetails.category || "Studio Collection"}</p>
                <h3 className="display-font text-5xl font-bold tracking-tight uppercase mb-8 leading-tight">
                  {productDetails.title}
                </h3>
                <p className="display-font text-4xl font-bold">
                  {productDetails.price?.amount} <span className="text-sm font-sans font-normal lowercase">{productDetails.price?.currency}</span>
                </p>
              </div>
              <p className="text-secondary italic leading-relaxed text-lg">"{productDetails.description}"</p>
              <div className="flex gap-16 pt-6">
                <div>
                  <p className="label-sm mb-2">Inventory</p>
                  <p className="display-font text-3xl font-bold">{productDetails.stock || 0}</p>
                </div>
                <div>
                  <p className="label-sm mb-2">Archived Variants</p>
                  <p className="display-font text-3xl font-bold">{productVariants.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Variants Section - Horizontal List */}
          <div className="space-y-16">
            <div className="flex items-end justify-between border-b border-gray-100 pb-10">
              <h4 className="display-font text-4xl tracking-tight uppercase">Product Variations</h4>
              <p className="label-sm text-secondary lowercase italic">{productVariants.length} registered silhouettes</p>
            </div>
            
            {productVariants.length > 0 ? (
              <div className="flex overflow-x-auto gap-12 pb-12 no-scrollbar snap-x snap-mandatory">
                {productVariants.map((variant, index) => (
                  <div 
                    key={variant._id || index} 
                    className="min-w-[400px] max-w-[400px] flex-shrink-0 snap-start surface-card p-10 group transition-all duration-500 hover:border-black fade-up" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="label-sm text-black mb-2 lowercase">{variant.attributes?.name || "Size"}: {Array.isArray(variant.attributes?.values) ? variant.attributes.values.join(", ") : variant.attributes?.values || "N/A"}</p>
                        <p className="label-sm text-secondary mb-0 lowercase italic">Palette: {variant.color}</p>
                      </div>
                      <p className="display-font text-2xl font-bold">{variant.price?.amount} <span className="text-[10px] font-sans lowercase">{variant.price?.currency}</span></p>
                    </div>
                    <ProductImageCarousel images={variant.images || []} title={variant.color} carouselKey={variant._id} />
                    <div className="mt-8 flex justify-between items-center border-t border-gray-50 pt-8">
                      <span className="label-sm mb-0 text-[11px] lowercase italic">Stock: {variant.stock || 0} units</span>
                      <button className="label-sm mb-0 text-black border-b border-black lowercase hover:text-secondary transition-colors">Update Piece</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center surface-card border-dashed bg-gray-50/50">
                <p className="label-sm text-secondary lowercase italic">No variations found in the studio archive.</p>
              </div>
            )}
          </div>
        </div>

        {/* Overlay Variant Form */}
        {showVariantForm && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40" 
              onClick={() => setShowVariantForm(false)}
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-[550px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out border-l border-gray-100 translate-x-0">
              <div className="h-full flex flex-col p-8 sm:p-16 overflow-y-auto">
                <div className="flex justify-between items-center mb-16 border-b border-gray-50 pb-10">
                  <h4 className="display-font text-4xl tracking-tight uppercase">Add Variation</h4>
                  <button onClick={() => setShowVariantForm(false)} className="label-sm text-secondary hover:text-black">Close —</button>
                </div>
                
                <form onSubmit={handleVariantSubmit} className="space-y-12">
                  <div>
                    <label className="label-sm">Attribute Type</label>
                    <input
                      type="text"
                      name="attributeName"
                      value={variantForm.attributeName}
                      onChange={handleVariantInputChange}
                      placeholder="e.g. Size"
                      className="field-input italic lowercase text-lg"
                    />
                  </div>
                  <div>
                    <label className="label-sm">Attribute Values</label>
                    <input
                      type="text"
                      name="attributeValues"
                      value={variantForm.attributeValues}
                      onChange={handleVariantInputChange}
                      placeholder="e.g. S, M, L (comma separated)"
                      className="field-input italic lowercase text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label className="label-sm">Color Palette</label>
                      <input
                        type="text"
                        name="color"
                        value={variantForm.color}
                        onChange={handleVariantInputChange}
                        placeholder="e.g. Noir"
                        className="field-input italic lowercase text-lg"
                      />
                    </div>
                    <div>
                      <label className="label-sm">Stock Qty</label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={variantForm.stock}
                        onChange={handleVariantInputChange}
                        className="field-input text-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label className="label-sm">Valuation</label>
                      <input
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        value={variantForm.amount}
                        onChange={handleVariantInputChange}
                        className="field-input text-lg"
                      />
                    </div>
                    <div>
                      <label className="label-sm">Currency</label>
                      <select
                        name="currency"
                        value={variantForm.currency}
                        onChange={handleVariantInputChange}
                        className="field-input appearance-none cursor-pointer text-lg"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label-sm">Visuals ({variantImages.length}/7)</label>
                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <label key={i} className={`aspect-[3/4] border rounded-default flex items-center justify-center cursor-pointer transition-all ${variantPreviewUrls[i] ? "border-gray-100 relative overflow-hidden" : "border-dashed border-gray-200 hover:border-black bg-gray-50/50"}`}>
                          {variantPreviewUrls[i] ? (
                            <>
                              <img src={variantPreviewUrls[i]} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={(e) => { e.preventDefault(); removeVariantImage(i); }} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center">
                                <span className="label-sm text-white border-b border-white mb-0 text-[10px]">Remove</span>
                              </button>
                            </>
                          ) : (
                            <span className="label-sm text-gray-300 text-[11px] mb-0 italic">Add</span>
                          )}
                          <input type="file" accept="image/*" multiple onChange={handleVariantImageUpload} disabled={variantImages.length >= 7} className="hidden" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 pt-10">
                    <button
                      type="submit"
                      disabled={isSubmittingVariant}
                      className="btn-primary flex-1 py-6 text-[12px]"
                    >
                      {isSubmittingVariant ? "REGISTERING..." : "REGISTER VERSION"}
                    </button>
                    <button
                      type="button"
                      onClick={resetVariantForm}
                      className="btn-outline px-10 py-6 text-[12px]"
                    >
                      CLEAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

export default ProductDetails;
