import { Link } from "react-router-dom";

const featuredProducts = [
  {
    title: "Wool Blend Overshirt",
    tone: "Stone",
    price: "INR 3,499",
    image:
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Relaxed Linen Shirt",
    tone: "Sand",
    price: "INR 2,699",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Tailored Utility Trousers",
    tone: "Olive",
    price: "INR 3,999",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=700&q=80",
  },
];

const Home = () => {
  return (
    <div className="page-shell min-h-screen text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        <header className="surface-card mb-8 flex flex-col gap-5 rounded-[2rem] px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="pill-tag">SNITCH EDIT</span>
            <span className="text-sm text-[var(--text-muted)]">
              Elevated modern menswear
            </span>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link className="btn-ghost" to="/login">
              Login
            </Link>
            <Link className="btn-ghost" to="/register">
              Register
            </Link>
            <Link className="btn-ghost" to="/seller/dashboard">
              Seller Dashboard
            </Link>
            <Link className="btn-primary" to="/seller/create-product">
              Add Product
            </Link>
          </nav>
        </header>

        <section className="mb-12 grid items-stretch gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="surface-card flex flex-col justify-between rounded-[2rem] px-7 py-8 sm:px-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Spring Studio Drop 2026
              </p>
              <h1 className="display-font mb-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Crafted Fits For Everyday Statements.
              </h1>
              <p className="max-w-xl text-base text-[var(--text-muted)] sm:text-lg">
                Discover polished silhouettes, breathable fabrics, and premium
                everyday layers designed for city life.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/register">
                Shop New Arrival
              </Link>
              <Link className="btn-ghost" to="/seller/dashboard">
                View Seller Space
              </Link>
            </div>
          </article>

          <article className="surface-card relative overflow-hidden rounded-[2rem] p-6">
            <img
              alt="New season editorial clothing look"
              className="h-full min-h-[320px] w-full rounded-[1.5rem] object-cover"
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
            />
            <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/90 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Editor Pick
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                Minimalist Layering Collection
              </p>
            </div>
          </article>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="surface-card rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Free Shipping
            </p>
            <p className="mt-2 text-lg font-semibold">On orders above INR 999</p>
          </div>
          <div className="surface-card rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Easy Return
            </p>
            <p className="mt-2 text-lg font-semibold">7-day hassle free return</p>
          </div>
          <div className="surface-card rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Premium Care
            </p>
            <p className="mt-2 text-lg font-semibold">Curated style assistance</p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Curated Collection
              </p>
              <h2 className="display-font mt-2 text-3xl sm:text-4xl">
                Bestselling Looks
              </h2>
            </div>
            <Link className="btn-ghost hidden sm:inline-flex" to="/register">
              Explore All
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                className="surface-card group overflow-hidden rounded-3xl"
                key={product.title}
              >
                <div className="overflow-hidden">
                  <img
                    alt={product.title}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                    src={product.image}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {product.tone} Tone
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
