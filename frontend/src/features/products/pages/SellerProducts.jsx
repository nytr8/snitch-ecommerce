import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useProduct from "../hooks/useProduct";
import SellerLayout from "../components/SellerLayout";

const SellerProducts = () => {
  const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  return (
    <SellerLayout
      title="Your Products"
      subtitle="Product Management"
      ctaLabel="+ Add New Product"
      ctaLink="/seller/create-product"
    >
      <div className="mb-12 flex items-center justify-between">
        <h3 className="display-font text-2xl font-bold tracking-tight uppercase">
          Active Collection
        </h3>
        <div className="flex gap-4">
          <button className="border border-gray-200 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-black">
            Filter
          </button>
          <button className="border border-gray-200 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-black">
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="border border-dashed border-gray-200 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
          Loading seller products...
        </div>
      ) : error ? (
        <div className="border border-red-200 bg-red-50 px-6 py-4 text-xs font-bold tracking-wider text-red-600 uppercase">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sellerProducts.length > 0 ? (
            sellerProducts.map((product) => (
              <Link
                to={`/seller/product/${product._id}`}
                className="group overflow-hidden border border-transparent transition-all duration-500 hover:border-gray-200"
                key={product._id}
              >
                <div className="relative aspect-[3/4] overflow-hidden border border-gray-100 bg-gray-50">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] tracking-widest text-gray-300 uppercase">
                      Image Missing
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteProduct(product._id);
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-red-500 text-white opacity-0 transition-opacity duration-300 hover:bg-red-600 group-hover:opacity-100"
                    title="Delete product"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-2 py-6">
                  <h4 className="mb-2 truncate text-sm font-bold tracking-widest text-[#1A1A1A] uppercase">
                    {product.title}
                  </h4>
                  <p className="display-font mb-4 text-xl font-bold">
                    {product.price?.amount}{" "}
                    <span className="text-xs font-normal tracking-widest text-gray-400 uppercase">
                      {product.price?.currency}
                    </span>
                  </p>
                  <button className="w-full border border-black py-3 text-[9px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-black hover:text-white">
                    Manage Item
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-gray-200 py-32">
              <h4 className="mb-4 text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
                Collection is Empty
              </h4>
              <p className="text-[10px] tracking-widest text-gray-300 uppercase">
                Begin by listing your premium items.
              </p>
              <Link
                to="/seller/create-product"
                className="mt-8 border border-black px-12 py-4 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-black hover:text-white"
              >
                Create First Product
              </Link>
            </div>
          )}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerProducts;
