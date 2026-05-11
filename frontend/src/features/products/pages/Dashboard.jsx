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
      <section className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-3">
        {[
          {
            title: "Inventory Status",
            value: totalProducts,
            trend: `${totalProducts} Items listed`,
          },
          {
            title: "Net Revenue",
            value: totalSales,
            trend: "Stable Performance (+12%)",
          },
          {
            title: "Fulfillment",
            value: pendingOrders,
            trend: "Action Required",
          },
        ].map((stat, i) => (
          <div
            key={stat.title}
            className="group surface-card p-12 transition-all duration-500 hover:border-black fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <h3 className="label-sm mb-8">
              {stat.title}
            </h3>
            <div className="display-font mb-6 text-6xl font-bold tracking-tighter">
              {stat.value}
            </div>
            <div className="mb-6 h-[1px] w-12 bg-gray-100 transition-colors group-hover:bg-black"></div>
            <p className="label-sm text-secondary lowercase italic">
              {stat.trend}
            </p>
          </div>
        ))}
      </section>

      <section className="surface-card p-12 fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-12">
          <h3 className="label-sm mb-0">Recent Activity</h3>
          <button className="label-sm mb-0 text-black border-b border-black">Export Data</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 label-sm">Product</th>
                <th className="pb-6 label-sm">Status</th>
                <th className="pb-6 label-sm">Stock</th>
                <th className="pb-6 label-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sellerProducts.slice(0, 5).map((product) => (
                <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-10 bg-gray-100 rounded-default overflow-hidden">
                        {product.images?.[0] && (
                          <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="font-semibold text-sm tracking-tight">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="label-sm text-[9px] px-3 py-1 bg-gray-50 rounded-full lowercase italic">Active</span>
                  </td>
                  <td className="py-6">
                    <span className="text-sm font-medium">{product.stock || 0} units</span>
                  </td>
                  <td className="py-6">
                    <button className="label-sm mb-0 text-secondary hover:text-black transition-colors">Edit</button>
                  </td>
                </tr>
              ))}
              {sellerProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-20 text-center label-sm text-secondary lowercase italic">No inventory recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SellerLayout>
  );
};

export default Dashboard;
