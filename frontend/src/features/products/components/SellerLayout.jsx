import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", to: "/seller/dashboard" },
  { name: "Products", to: "/seller/products" },
  { name: "Add Product", to: "/seller/create-product" },
];

const SellerLayout = ({ title, subtitle, ctaLabel, ctaLink, children }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-[#FCFBFA] text-[#1A1A1A]">
      <aside className="fixed flex h-full w-72 flex-col border-r border-gray-200 bg-white transition-all duration-300">
        <div className="border-b border-gray-100 p-10">
          <h1 className="display-font text-3xl font-bold tracking-tighter uppercase">
            Snitch
          </h1>
          <p className="mt-2 text-[9px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            Seller Portal
          </p>
        </div>

        <nav className="flex-1 space-y-4 p-8">
          {navItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center border px-4 py-3 text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-200 ${
                  isActive
                    ? "border-black bg-[#1A1A1A] text-white"
                    : "border-transparent text-gray-400 hover:border-gray-100 hover:text-[#1A1A1A]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 bg-gray-50/50 p-8">
          <div className="flex items-center gap-4 px-2">
            <div className="flex h-10 w-10 items-center justify-center bg-[#1A1A1A] text-[10px] font-bold tracking-widest text-white">
              JD
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase">
              <p className="font-bold">John Doe</p>
              <p className="mt-1 text-gray-400">Authorized Seller</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-72 max-w-[1500px] flex-1 p-16">
        <header className="mb-16 flex items-end justify-between border-b border-gray-200 pb-12">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
              {subtitle}
            </p>
            <h2 className="display-font text-5xl font-bold tracking-tight">
              {title}
            </h2>
          </div>
          {ctaLink && ctaLabel ? (
            <Link
              to={ctaLink}
              className="bg-[#1A1A1A] px-10 py-4 text-[11px] font-bold tracking-[0.3em] text-white uppercase transition-all hover:bg-black"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </header>

        {children}
      </main>
    </div>
  );
};

export default SellerLayout;
