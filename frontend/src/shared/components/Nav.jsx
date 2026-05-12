import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Nav = () => {
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === "seller";
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
              Bag (0)
            </Link>
            {isSeller && (
              <Link
                to="/seller/dashboard"
                className="label-sm mb-0 text-secondary hover:text-black transition-colors"
              >
                Seller Portal
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
