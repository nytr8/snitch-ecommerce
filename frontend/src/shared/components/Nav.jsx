import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hook/useAuth";

const Nav = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const cartCount = useSelector((state) =>
    Array.isArray(state?.cart?.items)
      ? state.cart.items.reduce(
          (total, item) => total + (Number(item?.quantity) > 0 ? Number(item.quantity) : 1),
          0,
        )
      : 0,
  );
  const isSeller = user?.role === "seller";

  const onLogout = async () => {
    await handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 nav-blur border-b border-gray-100 px-edge py-8 flex items-center justify-between">
      <div className="flex items-center gap-16">
        <Link
          to="/"
          className="display-font text-4xl font-bold tracking-tighter uppercase"
        >
          Snitch
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/shop"
            className="label-sm mb-0 hover:text-black transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/collections"
            className="label-sm mb-0 hover:text-black transition-colors"
          >
            Collections
          </Link>
          <Link
            to="/about"
            className="label-sm mb-0 hover:text-black transition-colors"
          >
            About
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {!user ? (
          <>
            <Link
              to="/login"
              className="label-sm mb-0 hover:text-black transition-colors"
            >
              Login
            </Link>
            <Link to="/register" className="btn-primary py-3 px-8 text-[10px]">
              Join Us
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              to="/cart"
              className="label-sm mb-0 hover:text-black transition-colors"
            >
              Bag ({cartCount})
            </Link>
            {isSeller && (
              <Link
                to="/seller/dashboard"
                className="label-sm mb-0 text-secondary hover:text-black transition-colors"
              >
                Seller Portal
              </Link>
            )}
            <button
              className="label-sm mb-0 hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onLogout}
              disabled={loading}
              type="button"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
