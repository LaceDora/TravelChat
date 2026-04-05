import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiPost } from "../../service/api";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Listen for Google OAuth popup callback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GOOGLE_LOGIN_SUCCESS" && event.data.user) {
        // Save user and redirect
        localStorage.setItem("user", JSON.stringify(event.data.user));
        navigate(`/profile/${event.data.user.id}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiPost<any>("/login", form);

      // ✅ Thành công
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Đăng nhập thành công!");
      navigate(`/profile/${data.user.id}`);
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMsg: string) => {
    toast.error(errorMsg);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url(/login-bg.jpg)" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-center text-gray-500 mb-8">
          Đăng nhập để lên kế hoạch cho chuyến đi nghỉ dưỡng tiếp theo của bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 disabled:bg-cyan-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In Button */}
        <GoogleLoginButton onError={handleGoogleError} />

        <p className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-500 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
