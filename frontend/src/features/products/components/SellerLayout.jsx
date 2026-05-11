import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", to: "/seller/dashboard" },
  { name: "Products", to: "/seller/products" },
  { name: "Add Product", to: "/seller/create-product" },
];

const SellerLayout = ({ title, subtitle, ctaLabel, ctaLink, extraActions, children }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <aside className="fixed flex h-full w-80 flex-col border-r border-gray-100 bg-white">
        <div className="p-12">
          <Link to="/" className="display-font text-4xl font-bold tracking-tighter uppercase block mb-2">
            Snitch
          </Link>
          <p className="label-sm text-secondary">
            Workspace v1.0
          </p>
        </div>

        <nav className="flex-1 px-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center px-6 py-4 rounded-default transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white"
                    : "label-sm text-secondary hover:bg-gray-50 hover:text-black mb-0"
                }`}
              >
                <span className={isActive ? "label-sm mb-0 text-white" : "label-sm mb-0"}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <div className="flex items-center gap-4 p-4 rounded-default bg-gray-50/50">
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              JD
            </div>
            <div>
              <p className="label-sm mb-0 text-black">John Doe</p>
              <p className="text-[10px] text-secondary italic lowercase">Authorized Seller</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-80 flex-1 p-20 max-w-[1600px]">
        <header className="mb-20 flex items-end justify-between border-b border-gray-50 pb-16">
          <div className="fade-up">
            <p className="label-sm text-secondary mb-4">
              {subtitle || "Seller Portal"}
            </p>
            <h2 className="display-font text-6xl tracking-tight">
              {title}
            </h2>
          </div>
          <div className="flex gap-4">
            {extraActions && extraActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={action.variant === 'outline' ? 'btn-outline' : 'btn-primary'}
              >
                {action.label}
              </button>
            ))}
            {ctaLink && ctaLabel && (
              <Link
                to={ctaLink}
                className="btn-primary"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </header>

        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
