import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useProduct from "../../products/hooks/useProduct";

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const allProducts = useSelector((state) => state.product.allProducts);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === "seller";

  useEffect(() => {
    handleGetAllProducts();
  }, [handleGetAllProducts]);

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-[#1A1A1A]">
      {/* Premium Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FCFBFA]/90 backdrop-blur-xl border-b border-gray-200 px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="text-3xl font-bold tracking-tighter display-font uppercase">Snitch</Link>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-[0.3em] uppercase">
            <Link to="/shop" className="hover:opacity-50 transition-opacity">Shop</Link>
            <Link to="/collections" className="hover:opacity-50 transition-opacity">Collections</Link>
            <Link to="/about" className="hover:opacity-50 transition-opacity">About</Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-[11px] font-bold tracking-[0.3em] uppercase hover:opacity-50 transition-opacity">Login</Link>
          <Link to="/register" className="bg-[#1A1A1A] text-white px-8 py-3 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-black transition-all">Join Us</Link>
          {isSeller ? (
            <Link to="/seller/dashboard" className="hidden sm:block text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-black transition-colors">Seller Portal</Link>
          ) : null}
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto px-12 pt-12 pb-32">
        {/* Editorial Hero Section - Sharp Corners */}
        <section className="relative h-[90vh] w-full overflow-hidden mb-32 border border-gray-200">
          <img
            alt="New season editorial clothing look"
            className="h-full w-full object-cover transition-transform duration-[3000ms] hover:scale-110"
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-20 left-20 max-w-3xl text-white">
            <p className="text-[12px] font-bold tracking-[0.5em] uppercase mb-6 text-white/70">Spring Studio Drop 2026</p>
            <h1 className="display-font text-7xl lg:text-9xl leading-[0.9] mb-12 tracking-tighter">
              Crafted Fits For <br />Modern Living.
            </h1>
            <div className="flex gap-6">
              <Link to="/shop" className="bg-white text-black px-12 py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gray-100 transition-all">
                Explore Collection
              </Link>
              {isSeller ? (
                <Link to="/seller/dashboard" className="border border-white/30 backdrop-blur-sm text-white px-12 py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white/10 transition-all">
                  Seller Space
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {/* Brand Values - Centered & Minimal */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48 px-20">
          {[
            { label: "Free Shipping", desc: "On orders above INR 999", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { label: "Easy Return", desc: "7-day hassle free return", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
            { label: "Premium Care", desc: "Curated style assistance", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }
          ].map((v, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">{v.label}</h3>
              <p className="text-2xl font-bold display-font tracking-tight">{v.desc}</p>
              <div className="w-8 h-[1px] bg-gray-200 mt-6"></div>
            </div>
          ))}
        </section>

        {/* Bestsellers Grid - Sharp & Spaced */}
        <section>
          <div className="flex items-end justify-between mb-16 border-b border-gray-200 pb-12">
            <div>
              <p className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#1A1A1A]/30 mb-4">Curated Selection</p>
              <h2 className="display-font text-6xl tracking-tight">All Products</h2>
            </div>
            <Link to="/shop" className="text-[11px] font-bold tracking-[0.3em] uppercase hover:opacity-50 transition-opacity border-b-2 border-black pb-2">
              Explore All
            </Link>
          </div>

          {loading ? (
            <div className="border border-dashed border-gray-200 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
              Loading products...
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-red-50 px-6 py-4 text-xs font-bold tracking-wider text-red-600 uppercase">
              {error}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="border border-dashed border-gray-200 py-24 text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {allProducts.map((product) => (
                <Link to={`/product/${product._id}`} className="group" key={product._id}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-8 border border-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        src={product.images[0].url}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] tracking-widest text-gray-300 uppercase">
                        Image Missing
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-[#1A1A1A] text-white px-4 py-2 text-[9px] font-bold tracking-[0.3em] uppercase">Live</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl font-bold tracking-tight uppercase">{product.title}</h3>
                      <p className="text-xl font-bold display-font whitespace-nowrap">
                        {product.price?.amount}{" "}
                        <span className="text-xs font-normal text-gray-400">
                          {product.price?.currency || "INR"}
                        </span>
                      </p>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400">
                      {(product.category || "General")} Category
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Premium Footer - Sharp & Architectural */}
      <footer className="bg-white border-t border-gray-200 pt-32 pb-16 px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-24 mb-32">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold display-font uppercase mb-12 tracking-tighter">Snitch</h2>
            <p className="text-gray-500 max-w-md mb-12 leading-relaxed text-sm">Elevating the modern wardrobe through precision tailoring and minimalist aesthetics. A curated journey toward timeless style and exclusive quality.</p>
            <div className="flex border-b border-black pb-2 max-w-sm">
              <input type="email" placeholder="Join our newsletter" className="bg-transparent border-none py-2 w-full text-sm focus:outline-none placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]" />
              <button className="text-[11px] font-bold tracking-[0.3em] uppercase hover:opacity-50">Join</button>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase">Shop</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase text-gray-400">
              <li><Link to="/shop" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-black transition-colors">Bestsellers</Link></li>
              <li><Link to="/shop" className="hover:text-black transition-colors">Premium Line</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase">Company</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase text-gray-400">
              <li><Link to="/about" className="hover:text-black transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="hover:text-black transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-black transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase">Support</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase text-gray-400">
              <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-black transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-gray-100 gap-8">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300">© 2026 SNITCH CLOTHING CO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12 text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300">
            <a href="#" className="hover:text-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-black transition-colors">Pinterest</a>
            <a href="#" className="hover:text-black transition-colors">X</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
