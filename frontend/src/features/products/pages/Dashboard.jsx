import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useProduct from "../hooks/useproduct";
import "./Dashboard.css";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const rawProducts = useSelector((state) => state.product.sellerProducts);

  // Handle both array format and the specific API response format { products: [...] }
  const sellerProducts = Array.isArray(rawProducts)
    ? rawProducts
    : rawProducts?.products || [];

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  // Mock stats to match the premium design feel
  const totalProducts = sellerProducts.length || 124; // Fallback to mock data if empty
  const totalSales = "1,45,000 INR";
  const pendingOrders = 12;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">Snitch Seller</div>
        <nav className="sidebar-nav">
          <a href="#dashboard" className="sidebar-link active">
            Dashboard
          </a>
          <a href="#products" className="sidebar-link">
            Products
          </a>
          <a href="#orders" className="sidebar-link">
            Orders
          </a>
          <a href="#settings" className="sidebar-link">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Overview</h1>
          <button className="add-product-btn">+ Add New Product</button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Sales</div>
            <div className="stat-value">{totalSales}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pending Orders</div>
            <div className="stat-value">{pendingOrders}</div>
          </div>
        </div>

        {/* Products */}
        <h2 className="products-section-title">Your Products</h2>
        <div className="products-grid">
          {sellerProducts.length > 0 ? (
            sellerProducts.map((product) => (
              <div className="product-card" key={product._id}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="product-image"
                  />
                ) : (
                  <div
                    className="product-image"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#747688",
                    }}
                  >
                    No Image
                  </div>
                )}
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">
                    {product.price?.amount} {product.price?.currency}
                  </p>
                  <p className="product-desc">{product.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No products found. Start by adding a new product!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
