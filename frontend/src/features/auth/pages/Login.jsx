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

    const result = await handleLogin({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      setSuccessMessage("Login successful. Welcome back!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-12">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 surface-card overflow-hidden fade-up shadow-2xl shadow-black/5">
        {/* Left Side: Editorial Content */}
        <aside className="relative hidden lg:block bg-gray-100 overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
            alt="Editorial fashion"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
          <div className="relative h-full flex flex-col justify-between p-20 text-white">
            <div>
              <Link
                to="/"
                className="display-font text-4xl font-bold tracking-tighter uppercase block"
              >
                Snitch
              </Link>
              <p className="label-sm text-white/60 mt-4 italic lowercase">
                Studio Access / Auth
              </p>
            </div>
            <div className="max-w-xs">
              <h1 className="display-font text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                Refined <br />
                Aesthetics.
              </h1>
              <p className="label-sm text-white/50 lowercase leading-relaxed italic">
                A study in architectural minimalism and timeless style.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side: Login Form */}
        <section className="p-12 sm:p-24 flex flex-col justify-center bg-white">
          <div className="mb-16">
            <p className="label-sm mb-4">Welcome Back</p>
            <h2 className="display-font text-6xl font-bold tracking-tight mb-6">
              Sign In
            </h2>
            <div className="w-12 h-[1px] bg-black"></div>
          </div>

          <form className="space-y-12" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="label-sm mb-0" htmlFor="email">
                Identity / Email
              </label>
              <input
                className="field-input text-lg lowercase italic"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="name@studio.com"
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="label-sm mb-0" htmlFor="password">
                  Security / Password
                </label>
                <a
                  href="#"
                  className="label-sm mb-0 text-gray-300 hover:text-black lowercase italic border-b border-transparent hover:border-black transition-all"
                >
                  Recovery?
                </a>
              </div>
              <input
                className="field-input text-lg"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                required
                type="password"
                value={formData.password}
              />
            </div>

            {error && (
              <div className="p-6 bg-red-50 text-red-600 label-sm border-l-2 border-red-600 mb-0">
                Auth Error: {error}
              </div>
            )}

            {successMessage && (
              <div className="p-6 bg-green-50 text-green-600 label-sm border-l-2 border-green-600 mb-0">
                Status: {successMessage}
              </div>
            )}

            <button
              className="btn-primary w-full py-6 text-[11px]"
              disabled={loading}
              type="submit"
            >
              {loading ? "Verifying..." : "Enter Workspace"}
            </button>
          </form>

          <div className="mt-20">
            <p className="label-sm text-gray-400 lowercase italic">
              New to the studio?{" "}
              <Link
                to="/register"
                className="text-black border-b border-black pb-1 ml-2 hover:text-gray-500 hover:border-gray-500 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
