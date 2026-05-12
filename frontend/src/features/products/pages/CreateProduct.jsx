import React, { useState } from "react";
import useProduct from "../hooks/useProduct";
import SellerLayout from "../components/SellerLayout";

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    quantity: "",
    currency: "INR",
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 7 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setImages((prev) => [...prev, ...filesToAdd]);
    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imageUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a product title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a product description");
      return;
    }

    if (!formData.category.trim()) {
      alert("Please enter a product category");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (formData.quantity === "" || Number(formData.quantity) < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);
    try {
      const productFormData = new FormData();
      productFormData.append("title", formData.title);
      productFormData.append("description", formData.description);
      productFormData.append("category", formData.category);
      productFormData.append("priceAmount", parseFloat(formData.amount));
      productFormData.append("quantity", Number(formData.quantity));
      productFormData.append("priceCurrency", formData.currency);

      images.forEach((image) => {
        productFormData.append("images", image);
      });

      const result = await handleCreateProduct(productFormData);
      if (!result.success) {
        throw new Error(result.message);
      }
      alert("Product created successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        amount: "",
        quantity: "",
        currency: "INR",
      });
      setImages([]);
      setImageUrls([]);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SellerLayout title="Register Piece" subtitle="Studio Inventory">
      <div className="w-full max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-24"
        >
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-12">
              <label className="label-sm mb-6">
                Visual Assets ({images.length}/7)
              </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 7 }).map((_, index) => (
                  <label
                    key={index}
                    className={`aspect-[3/4] border border-dashed rounded-default flex items-center justify-center cursor-pointer transition-all ${
                      imageUrls[index]
                        ? "border-gray-100 relative overflow-hidden"
                        : "border-gray-200 hover:border-black bg-gray-50/50"
                    }`}
                  >
                    {imageUrls[index] ? (
                      <>
                        <img
                          src={imageUrls[index]}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <span className="label-sm text-white border-b border-white">
                            Remove
                          </span>
                        </button>
                      </>
                    ) : (
                      <span className="label-sm text-gray-300 lowercase italic">
                        Add
                      </span>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={images.length >= 7}
                    />
                  </label>
                ))}
              </div>
              <p className="label-sm text-gray-300 lowercase italic">
                Drag high-resolution imagery here.
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <label className="label-sm">Piece Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Sculpted Wool Blazer"
                className="field-input text-lg lowercase italic"
              />
            </div>

            <div>
              <label className="label-sm">Archival Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the silhouette and material..."
                rows="4"
                className="field-input text-lg italic leading-relaxed h-32"
              />
            </div>

            <div>
              <label className="label-sm">Collection Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Studio Outerwear"
                className="field-input text-lg lowercase italic"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <label className="label-sm">Base Valuation</label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="field-input text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="label-sm">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  placeholder="0"
                  className="field-input text-lg"
                />
              </div>

              <div>
                <label className="label-sm">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="field-input text-lg cursor-pointer appearance-none"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6 pt-12">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "REGISTRATION..." : "REGISTER PIECE"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    amount: "",
                    quantity: "",
                    currency: "INR",
                  });
                  setImages([]);
                  setImageUrls([]);
                }}
                className="btn-outline px-12"
              >
                CLEAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default CreateProduct;
