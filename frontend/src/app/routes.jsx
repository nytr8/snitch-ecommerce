import { Navigate, createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import SellerProducts from "../features/products/pages/SellerProducts";
import Home from "../features/home/pages/Home";
import Protected from "../features/auth/pages/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
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
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "create-product",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "products",
        element: (
          <Protected>
            <SellerProducts />
          </Protected>
        ),
      },
    ],
  },
]);
