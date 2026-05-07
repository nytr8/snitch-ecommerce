import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await handleRegister(formData);
    if (result?.success) {
      setSuccessMessage("Account created successfully. You can now sign in.");
      setFormData({
        fullname: "",
        contact: "",
        email: "",
        password: "",
      });
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="surface-card fade-up order-2 rounded-[2rem] p-6 sm:p-8 lg:order-1 lg:p-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Join Snitch
            </p>
            <h1 className="display-font mt-2 text-3xl sm:text-4xl">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Build your account to save favourites and checkout faster.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-1.5 block text-sm font-semibold"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                className="field-input"
                id="fullname"
                name="fullname"
                onChange={handleChange}
                placeholder="Your full name"
                required
                type="text"
                value={formData.fullname}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-semibold"
                htmlFor="contact"
              >
                Contact Number
              </label>
              <input
                className="field-input"
                id="contact"
                name="contact"
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
                type="tel"
                value={formData.contact}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="field-input"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="field-input"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  type="password"
                  value={formData.password}
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--text-primary)] underline" to="/login">
              Login
            </Link>
          </p>
        </section>

        <aside className="surface-card fade-up order-1 flex flex-col justify-between rounded-[2rem] p-8 sm:p-10 lg:order-2">
          <div>
            <span className="pill-tag mb-4">NEW SEASON</span>
            <h2 className="display-font text-4xl leading-tight sm:text-5xl">
              Upgrade Your Wardrobe Story.
            </h2>
            <p className="mt-4 max-w-md text-sm text-[var(--text-muted)] sm:text-base">
              Be first to access trend reports, curated drops, and personalized
              picks made for your style.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Why Join
              </p>
              <p className="mt-2 text-sm font-semibold">Wishlist and alerts</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Why Join
              </p>
              <p className="mt-2 text-sm font-semibold">
                Faster checkout experience
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;
