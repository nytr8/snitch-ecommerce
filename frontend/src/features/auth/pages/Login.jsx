import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
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
    setSuccessMessage("");

    const result = await handleLogin(formData);

    if (result.success) {
      setSuccessMessage("Login successful. Welcome back!");
    }
    navigate("/");
  };

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.1fr_1fr]">
        <aside className="surface-card fade-up flex flex-col justify-between rounded-[2rem] p-8 sm:p-10">
          <div>
            <span className="pill-tag mb-4">SNITCH CLUB</span>
            <h1 className="display-font text-4xl leading-tight sm:text-5xl">
              Style Starts With Confidence.
            </h1>
            <p className="mt-4 max-w-md text-sm text-[var(--text-muted)] sm:text-base">
              Sign in to track orders, unlock tailored recommendations, and save
              your best looks.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Member Benefit
              </p>
              <p className="mt-2 text-sm font-semibold">Priority support</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Member Benefit
              </p>
              <p className="mt-2 text-sm font-semibold">Early access drops</p>
            </div>
          </div>
        </aside>

        <section className="surface-card fade-up rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Welcome Back
            </p>
            <h2 className="display-font mt-2 text-3xl sm:text-4xl">Sign In</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Access your account to continue shopping.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
                type="password"
                value={formData.password}
              />
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

            <button
              className="btn-primary w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            New here?{" "}
            <Link
              className="font-semibold text-[var(--text-primary)] underline"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
