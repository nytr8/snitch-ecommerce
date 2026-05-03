import React, { useState } from "react";
import useProduct from "../hooks/useproduct";

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "USD",
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

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
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
      productFormData.append("amount", parseFloat(formData.amount));
      productFormData.append("currency", formData.currency);

      images.forEach((image) => {
        productFormData.append("images", image);
      });

      await handleCreateProduct(productFormData);
      alert("Product created successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        amount: "",
        currency: "USD",
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
    <div className="min-h-screen bg-neutral flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white border border-secondary/30 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-serif font-bold text-primary mb-1">
            Create New Product
          </h1>
          <p className="text-label font-sans text-primary/60 uppercase">
            Add a new product to your store
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            {/* Image Gallery */}
            <div>
              <label className="block text-label font-sans font-semibold text-primary/60 uppercase mb-3">
                Product Images ({images.length}/7)
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <label
                    key={index}
                    className={`aspect-square border-2 border-dashed flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                      imageUrls[index]
                        ? "border-secondary/50 bg-neutral relative overflow-hidden"
                        : "border-secondary hover:border-tertiary"
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
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <svg
                        className="h-6 w-6 text-primary/30"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                      </svg>
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
              <p className="text-xs font-sans text-primary/50">
                Click or drag to add images (max 7)
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-label font-sans font-semibold text-primary/60 uppercase mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Sculpted Wool Blazer"
                className="w-full px-4 py-2 border border-secondary/30 font-sans text-sm bg-neutral/50 focus:outline-none focus:border-tertiary transition-colors placeholder:text-primary/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-label font-sans font-semibold text-primary/60 uppercase mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="3"
                className="w-full px-4 py-2 border border-secondary/30 font-sans text-sm bg-neutral/50 focus:outline-none focus:border-tertiary transition-colors resize-none placeholder:text-primary/30"
              />
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label font-sans font-semibold text-primary/60 uppercase mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary font-sans text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-secondary/30 font-sans text-sm bg-neutral/50 focus:outline-none focus:border-tertiary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label font-sans font-semibold text-primary/60 uppercase mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary/30 font-sans text-sm bg-neutral/50 focus:outline-none focus:border-tertiary transition-colors cursor-pointer"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 bg-black font-sans font-semibold text-white transition-all rounded-lg ${
                  isSubmitting
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-primary hover:bg-dark active:scale-95"
                }`}
              >
                {isSubmitting ? "PUBLISHING..." : "PUBLISH PRODUCT"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    amount: "",
                    currency: "USD",
                  });
                  setImages([]);
                  setImageUrls([]);
                }}
                className="px-6 py-3 border-2 border-primary text-primary font-sans font-semibold hover:bg-primary/5 transition-all rounded-lg"
              >
                CLEAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
