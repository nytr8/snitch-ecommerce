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
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-12">
      <div className="w-full max-w-[1300px] grid grid-cols-1 lg:grid-cols-2 surface-card overflow-hidden fade-up shadow-2xl shadow-black/5">
        
        {/* Left Side: Register Form */}
        <section className="p-12 sm:p-24 flex flex-col justify-center order-2 lg:order-1 bg-white">
          <div className="mb-16">
            <p className="label-sm mb-4">New Membership</p>
            <h2 className="display-font text-6xl font-bold tracking-tight mb-6">Join Studio</h2>
            <div className="w-12 h-[1px] bg-black"></div>
          </div>

          <form className="space-y-12" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="label-sm mb-0" htmlFor="fullname">Legal Name</label>
                <input
                  className="field-input text-lg lowercase italic"
                  id="fullname"
                  name="fullname"
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  type="text"
                  value={formData.fullname}
                />
              </div>
              <div className="space-y-4">
                <label className="label-sm mb-0" htmlFor="contact">Contact / Mobile</label>
                <input
                  className="field-input text-lg lowercase italic"
                  id="contact"
                  name="contact"
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  required
                  type="tel"
                  value={formData.contact}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="label-sm mb-0" htmlFor="email">Identity / Email</label>
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
              <label className="label-sm mb-0" htmlFor="password">Security / Password</label>
              <input
                className="field-input text-lg"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                type="password"
                value={formData.password}
              />
            </div>

            {error && (
              <div className="p-6 bg-red-50 text-red-600 label-sm border-l-2 border-red-600 mb-0">
                System Error: {error}
              </div>
            )}

            {successMessage && (
              <div className="p-6 bg-green-50 text-green-600 label-sm border-l-2 border-green-600 mb-0">
                Success: {successMessage}
              </div>
            )}

            <button
              className="btn-primary w-full py-6 text-[11px] mt-4"
              disabled={loading}
              type="submit"
            >
              {loading ? "Processing..." : "Create Identity"}
            </button>
          </form>

          <div className="mt-20">
            <p className="label-sm text-gray-400 lowercase italic">
              Already a member?{" "}
              <Link to="/login" className="text-black border-b border-black pb-1 ml-2 hover:text-gray-500 hover:border-gray-500 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </section>

        {/* Right Side: Editorial Image */}
        <aside className="relative hidden lg:block bg-gray-100 overflow-hidden group order-1 lg:order-2">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" 
            alt="Editorial fashion" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
          <div className="relative h-full flex flex-col justify-between p-20 text-white">
            <div>
              <Link to="/" className="display-font text-4xl font-bold tracking-tighter uppercase">Snitch</Link>
              <p className="label-sm text-white/60 mt-4 italic lowercase">Limited Memberships</p>
            </div>
            <div className="max-w-xs">
              <h1 className="display-font text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                Curated <br />Excellence.
              </h1>
              <p className="label-sm text-white/50 lowercase leading-relaxed italic">
                Access trend reports, private drops, and architectural silhouettes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;
