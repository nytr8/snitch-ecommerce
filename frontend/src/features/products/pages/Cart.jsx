import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Cart = () => {
  // In a real app, you'd fetch the cart items from Redux or an API.
  // For this design implementation, I'll use placeholders.
  const cartItems = [
    {
      id: 1,
      title: "Architectural Overcoat",
      price: "45,000",
      color: "Ivory",
      size: "L",
      image: "https://images.unsplash.com/photo-1539106609214-0d75556d337a?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Navigation */}
      <nav className="nav-blur border-b border-gray-100 px-edge py-8 flex items-center justify-between">
        <Link to="/" className="display-font text-4xl font-bold tracking-tighter uppercase">Snitch</Link>
        <Link to="/shop" className="label-sm mb-0 text-secondary hover:text-black transition-colors italic">Continue Browsing</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-edge py-24">
        <header className="mb-20 fade-up">
          <p className="label-sm text-secondary mb-4">Your Selection</p>
          <h1 className="display-font text-7xl tracking-tight">Shopping Bag</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            {cartItems.map((item, i) => (
              <div key={item.id} className="flex gap-10 pb-12 border-b border-gray-50 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-48 aspect-[3/4] rounded-default overflow-hidden border border-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="display-font text-3xl tracking-tight uppercase">{item.title}</h3>
                      <p className="display-font text-2xl">{item.price} <span className="text-[10px] font-sans font-normal">INR</span></p>
                    </div>
                    <div className="flex gap-8">
                      <p className="label-sm text-secondary lowercase italic">Color: {item.color}</p>
                      <p className="label-sm text-secondary lowercase italic">Size: {item.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 border border-gray-100 rounded-full px-6 py-2">
                      <button className="label-sm mb-0 text-black hover:opacity-50">—</button>
                      <span className="label-sm mb-0">01</span>
                      <button className="label-sm mb-0 text-black hover:opacity-50">+</button>
                    </div>
                    <button className="label-sm mb-0 text-red-500 border-b border-red-500 pb-1 lowercase italic">Remove Item</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="surface-card p-12 sticky top-32">
              <h3 className="label-sm mb-10 text-black">Summary</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between">
                  <p className="label-sm text-secondary lowercase italic mb-0">Subtotal</p>
                  <p className="font-bold">45,000 INR</p>
                </div>
                <div className="flex justify-between">
                  <p className="label-sm text-secondary lowercase italic mb-0">Shipping</p>
                  <p className="label-sm text-black mb-0">Complimentary</p>
                </div>
              </div>
              <div className="h-[1px] bg-gray-100 mb-10"></div>
              <div className="flex justify-between mb-12">
                <p className="label-sm text-black font-bold uppercase mb-0">Total</p>
                <p className="display-font text-4xl">45,000 <span className="text-xs font-sans">INR</span></p>
              </div>
              <button className="btn-primary w-full py-6 text-sm">Proceed to Checkout</button>
              <p className="label-sm text-gray-300 text-center mt-8 text-[9px] lowercase italic">Tax included. Secure payment guaranteed.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;
