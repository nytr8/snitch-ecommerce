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
    <div className="min-h-screen bg-background text-on-background">
      {/* Modern Editorial Navigation */}

      <main className="max-w-[1800px] mx-auto pt-12 pb-32">
        {/* Editorial Hero Section */}
        <section className="px-edge mb-section">
          <div className="relative h-[85vh] w-full overflow-hidden rounded-default fade-up">
            <img
              alt="Spring Studio Drop 2026 Editorial"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1539106609214-0d75556d337a?auto=format&fit=crop&w=1800&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-20 left-16 max-w-4xl text-white">
              <p className="label-sm text-white/80 mb-6 tracking-[0.4em]">
                Spring Studio Drop 2026
              </p>
              <h1 className="display-font text-7xl lg:text-9xl leading-[0.9] mb-12 tracking-tighter">
                Architectural <br />
                Minimalism.
              </h1>
              <div className="flex gap-6">
                <Link
                  to="/shop"
                  className="bg-white text-black px-12 py-5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-default hover:bg-gray-100 transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Philosophy - Massive Spacing */}
        <section className="px-edge mb-section grid grid-cols-1 md:grid-cols-3 gap-32">
          {[
            {
              title: "Timeless Design",
              desc: "Pieces that transcend seasonal trends through architectural consideration.",
            },
            {
              title: "Ethical Craftsmanship",
              desc: "Small-batch production ensuring the highest standards of localized quality.",
            },
            {
              title: "Quiet Luxury",
              desc: "Confidence found in restraint. Materials presented without visual noise.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="label-sm mb-6 text-black">{v.title}</h3>
              <p className="text-xl font-medium leading-relaxed text-secondary italic">
                "{v.desc}"
              </p>
              <div className="w-12 h-[1px] bg-black mt-8"></div>
            </div>
          ))}
        </section>

        {/* Curated Bestsellers */}
        <section className="px-edge">
          <div className="flex items-end justify-between mb-20 border-b border-gray-100 pb-12">
            <div>
              <p className="label-sm text-secondary mb-4">Curated Selection</p>
              <h2 className="display-font text-6xl tracking-tight">
                The Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              className="label-sm text-black border-b-2 border-black pb-2 hover:opacity-50 transition-opacity"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-24 text-center label-sm text-secondary">
              Retrieving Collection...
            </div>
          ) : error ? (
            <div className="py-12 label-sm text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {allProducts.length > 0 ? (
                allProducts.slice(0, 6).map((product, i) => (
                  <Link
                    to={`/product/${product._id}`}
                    className="group block"
                    key={product._id}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-8 rounded-default border border-gray-100">
                      {product.images?.[0] ? (
                        <img
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          src={product.images[0].url}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center label-sm text-gray-300">
                          Image Missing
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 label-sm text-[8px] rounded-full">
                        New In
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight uppercase mb-1">
                          {product.title}
                        </h3>
                        <p className="label-sm text-secondary lowercase italic">
                          {product.category || "Studio"}
                        </p>
                      </div>
                      <p className="text-xl font-bold display-font">
                        {product.price?.amount}{" "}
                        <span className="text-[10px] font-normal">
                          {product.price?.currency || "INR"}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-24 text-center label-sm text-secondary italic">
                  Collection coming soon.
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 pt-32 pb-16 px-edge">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-24 mb-32">
          <div className="lg:col-span-2">
            <h2 className="display-font text-5xl font-bold uppercase mb-12 tracking-tighter">
              Snitch
            </h2>
            <p className="text-secondary max-w-md mb-12 leading-relaxed text-sm italic">
              Elevating the modern wardrobe through precision tailoring and
              architectural minimalism. A curated journey toward timeless style.
            </p>
            <div className="flex border-b border-black pb-2 max-w-sm">
              <input
                type="email"
                placeholder="JOIN OUR NEWSLETTER"
                className="bg-transparent border-none py-2 w-full text-[10px] font-bold tracking-widest focus:outline-none placeholder:text-gray-300"
              />
              <button className="label-sm mb-0 hover:opacity-50">Join</button>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="label-sm text-black">Shop</h4>
            <ul className="space-y-4 label-sm text-secondary lowercase">
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">
                  Premium Line
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="label-sm text-black">Support</h4>
            <ul className="space-y-4 label-sm text-secondary lowercase">
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-black transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-black transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-black transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="label-sm text-black">Follow</h4>
            <ul className="space-y-4 label-sm text-secondary lowercase">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-16 border-t border-gray-50 flex justify-between items-center">
          <p className="label-sm text-gray-300 text-[9px]">
            © 2026 SNITCH STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
