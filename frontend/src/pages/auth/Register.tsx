import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiGet, apiPost } from "../../service/api";

interface Country {
  id: number;
  name: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    country_id: "", // giữ string cho select
    password: "",
    password_confirmation: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGet<Country[]>("/countries")
      .then((data) => setCountries(data))
      .catch(() => toast.error("Không thể tải danh sách quốc gia"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.agree) {
      toast.error("Vui lòng đồng ý với các điều khoản");
      return;
    }

    if (form.password !== form.password_confirmation) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      await apiPost("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        country_id: Number(form.country_id),
      });

      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT – INTRO */}
        <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Bắt đầu hành trình của bạn ✈️
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Khám phá những điểm đến tuyệt vời nhất khắp Đông Nam Á và những trải
            nghiệm khó quên.
          </p>
        </div>

        {/* RIGHT – FORM */}
        <div className="px-8 py-12 md:px-12">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-cyan-600 hover:underline"
            >
              Home
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            {/* COUNTRY */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Country of Residence
              </label>
              <select
                name="country_id"
                value={form.country_id}
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PASSWORD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Confirm Password
                </label>
                <input
                  name="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* TERMS */}
            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <span className="text-cyan-600 font-medium cursor-pointer">
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span className="text-cyan-600 font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-bold transition disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
