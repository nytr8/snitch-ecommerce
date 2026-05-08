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
    <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-0 md:p-12">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-200 overflow-hidden">
        {/* Left Side: Editorial Content */}
        <aside className="relative hidden lg:block bg-gray-100 overflow-hidden group border-r border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1539109132304-3915502adcad?auto=format&fit=crop&w=800&q=80"
            alt="Editorial fashion"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          <div className="relative h-full flex flex-col justify-between p-20 text-white">
            <div>
              <Link
                to="/"
                className="text-4xl font-bold display-font tracking-tighter uppercase"
              >
                Snitch
              </Link>
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase mt-4 text-white/50 italic underline underline-offset-8">
                Authorized Access Only
              </p>
            </div>
            <div className="max-w-xs">
              <h1 className="text-5xl font-bold display-font tracking-tight leading-[1.1] mb-8">
                The New <br />
                Era of Style.
              </h1>
              <p className="text-xs text-white/60 leading-relaxed font-bold tracking-widest uppercase">
                Step into a world of curated aesthetics and precision tailoring.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side: Login Form */}
        <section className="p-12 sm:p-24 flex flex-col justify-center bg-white">
          <div className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-gray-300 mb-4">
              Welcome Back
            </p>
            <h2 className="text-6xl font-bold display-font tracking-tight mb-4">
              Sign In
            </h2>
            <div className="w-12 h-[1px] bg-black"></div>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label
                className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400"
                htmlFor="email"
              >
                Identity / Email
              </label>
              <input
                className="w-full bg-transparent border-b border-gray-200 px-0 py-4 text-sm focus:border-black transition-all outline-none placeholder:text-gray-200"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="name@email.com"
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label
                  className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400"
                  htmlFor="password"
                >
                  Security / Password
                </label>
                <a
                  href="#"
                  className="text-[9px] font-bold text-gray-300 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black transition-all"
                >
                  Recovery
                </a>
              </div>
              <input
                className="w-full bg-transparent border-b border-gray-200 px-0 py-4 text-sm focus:border-black transition-all outline-none placeholder:text-gray-200"
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
              <div className="p-6 bg-rose-50 text-rose-600 text-[10px] font-bold tracking-widest uppercase border-l-2 border-rose-600">
                Authentication Error: {error}
              </div>
            )}

            {successMessage && (
              <div className="p-6 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-widest uppercase border-l-2 border-emerald-600">
                Status: {successMessage}
              </div>
            )}

            <button
              className="w-full bg-[#1A1A1A] text-white py-6 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-black transition-all shadow-none hover:shadow-2xl active:scale-[0.99] disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Verifying..." : "Enter Portal"}
            </button>
          </form>

          <div className="mt-20">
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              New to the house?{" "}
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
