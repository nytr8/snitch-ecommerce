import { Navigate, createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import SellerProducts from "../features/products/pages/SellerProducts";
import ProductDetails from "../features/products/pages/ProductDetails";
import Home from "../features/home/pages/Home";
import UserProductDetails from "../features/home/pages/UserProductDetails";
import Protected from "../features/auth/pages/Protected";
import Cart from "../features/products/pages/Cart";
import Applayout from "./Applayout";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },
      {
        path: "/product/:id",
        element: <UserProductDetails />,
      },
      {
        path: "/seller",
        children: [
          {
            index: true,
            element: <Navigate to="/seller/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <Protected sellerOnly>
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "create-product",
            element: (
              <Protected sellerOnly>
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "products",
            element: (
              <Protected sellerOnly>
                <SellerProducts />
              </Protected>
            ),
          },
          {
            path: "product/:id",
            element: (
              <Protected sellerOnly>
                <ProductDetails />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);
