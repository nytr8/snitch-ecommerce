import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useProduct from "../hooks/useProduct";
import SellerLayout from "../components/SellerLayout";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const totalProducts = sellerProducts.length;
  const totalSales = "1,45,000 INR";
  const pendingOrders = 12;

  return (
    <SellerLayout
      title="Dashboard"
      subtitle="Workspace Overview"
      ctaLabel="+ Add New Product"
      ctaLink="/seller/create-product"
    >
      <section className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
        {[
          {
            title: "Inventory Status",
            value: totalProducts,
            trend: `${totalProducts} Items listed`,
          },
          {
            title: "Net Revenue",
            value: totalSales,
            trend: "Stable Performance",
          },
          {
            title: "Fulfillment",
            value: pendingOrders,
            trend: "Action Required",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="group border border-gray-100 bg-white p-10 transition-colors duration-500 hover:border-black"
          >
            <h3 className="mb-6 text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
              {stat.title}
            </h3>
            <div className="display-font mb-4 text-5xl font-bold tracking-tighter">
              {stat.value}
            </div>
            <div className="mb-4 h-[1px] w-8 bg-gray-100 transition-colors group-hover:bg-black"></div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              {stat.trend}
            </p>
          </div>
        ))}
      </section>
    </SellerLayout>
  );
};

export default Dashboard;
