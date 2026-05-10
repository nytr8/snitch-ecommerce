import React, { useEffect, useMemo, useState } from "react";
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
  const { handleProductDetails } = useProduct();
  const productDetails = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const productImages = useMemo(() => {
    if (!productDetails?.images || !Array.isArray(productDetails.images)) {
      return [];
    }
    return productDetails.images.filter((image) => image?.url);
  }, [productDetails]);
  const carouselKey = productDetails?._id || id;

  useEffect(() => {
    if (id) {
      handleProductDetails(id);
    }
  }, [id, handleProductDetails]);

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
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ProductDetails;
