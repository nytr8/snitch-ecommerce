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
      title="Archive"
      subtitle="Studio Inventory"
      ctaLabel="+ Register Piece"
      ctaLink="/seller/create-product"
    >
      <div className="mb-16 flex items-end justify-between border-b border-gray-50 pb-8">
        <h3 className="display-font text-3xl tracking-tight uppercase">
          Active Collection
        </h3>
        <div className="flex gap-6">
          <button className="label-sm mb-0 text-black border-b border-black lowercase">Filter</button>
          <button className="label-sm mb-0 text-secondary lowercase italic">Sort / Recent</button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center label-sm text-secondary italic">Retrieving Archive...</div>
      ) : error ? (
        <div className="label-sm text-red-500 p-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3">
          {sellerProducts.length > 0 ? (
            sellerProducts.map((product, i) => (
              <div
                className="group relative fade-up"
                key={product._id}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Link to={`/seller/product/${product._id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-default border border-gray-50 bg-gray-50 mb-8">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center label-sm text-gray-300 italic">No Imagery</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 label-sm mb-0 text-[8px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold tracking-tight uppercase mb-1">{product.title}</h4>
                      <p className="label-sm text-secondary lowercase italic mb-4">{product.category || "Studio Line"}</p>
                    </div>
                    <p className="display-font text-xl font-bold">
                      {product.price?.amount} <span className="text-[10px] font-sans font-normal">{product.price?.currency}</span>
                    </p>
                  </div>
                </Link>
                <div className="flex gap-4 pt-4 border-t border-gray-50">
                   <Link to={`/seller/product/${product._id}`} className="label-sm mb-0 text-black border-b border-black lowercase">Manage</Link>
                   <button 
                    onClick={() => { if(window.confirm("Archiving this piece will remove it from the live collection. Proceed?")) handleDeleteProduct(product._id); }}
                    className="label-sm mb-0 text-red-400 hover:text-red-600 lowercase italic"
                   >
                     Archive Piece
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center surface-card border-dashed bg-gray-50/50">
              <h4 className="label-sm text-secondary mb-8 lowercase italic">
                The archive is currently empty.
              </h4>
              <Link
                to="/seller/create-product"
                className="btn-outline"
              >
                Register First Piece
              </Link>
            </div>
          )}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerProducts;
