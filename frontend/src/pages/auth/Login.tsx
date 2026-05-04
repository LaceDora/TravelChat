import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiPost } from "../../service/api";
import GoogleLoginButton from "../../components/GoogleLoginButton";

// Thêm ChevronLeft cho nút quay lại
import { Loader2, Mail, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logic Google OAuth & Handle Change (Giữ nguyên của bạn)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GOOGLE_LOGIN_SUCCESS" && event.data.user) {
        const { user, token, access_token } = event.data;
        localStorage.setItem("user", JSON.stringify(user));
        const finalToken = token || access_token;
        if (finalToken) localStorage.setItem("token", finalToken);
        toast.success("Đăng nhập Google thành công!");
        navigate(`/profile/${user.id}`);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiPost<any>("/login", form);
      localStorage.setItem("user", JSON.stringify(data.user));
      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công!");
        navigate(`/profile/${data.user.id}`);
      } else {
        toast.error("Lỗi xác thực: Không nhận được mã truy cập.");
      }
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
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-900">
      {/* NÚT QUAY LẠI (BACK BUTTON) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all group shadow-lg"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-sm font-bold uppercase tracking-widest">
          Quay lại
        </span>
      </button>

      {/* 1. LAYER ẢNH NỀN TỐI ƯU ĐỘ NÉT */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-[10s] scale-110 hover:scale-100"
        style={{
          backgroundImage:
            "url('https://vmstyle.vn/wp-content/uploads/2025/09/hinh-nen-thien-nhien-hung-vi-nhat-the-gioi-nui-cao-va-thac-nuoc-4k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-brightness-90"></div>
      </div>

      {/* 2. FORM ĐĂNG NHẬP (GLASSMORPHISM) */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-[16px] rounded-[2.5rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 z-10 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-4">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[3px]">
              Travel Experience
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            HÀNH TRÌNH <span className="text-cyan-400">MỚI</span>
          </h1>
          <p className="text-slate-300 text-sm font-light leading-relaxed">
            Khám phá những vùng đất chưa từng đặt chân đến
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
              Email của bạn
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:scale-110 transition-transform"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-black/30 transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between ml-1">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">
                Mật khẩu
              </label>
              <button
                type="button"
                className="text-[10px] text-cyan-400 hover:text-white transition-colors font-bold uppercase tracking-widest"
              >
                Quên?
              </button>
            </div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:scale-110 transition-transform"
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-black/30 transition-all shadow-inner"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-4 rounded-2xl font-black shadow-[0_10px_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-400 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Đăng nhập ngay"
            )}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-white/5"></div>
          <span className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[3px]">
            Hoặc
          </span>
          <div className="flex-1 border-t border-white/5"></div>
        </div>

        <div className="flex justify-center transition-transform hover:scale-105 active:scale-95">
          <GoogleLoginButton onError={handleGoogleError} />
        </div>

        <p className="text-center mt-10 text-white/40 text-xs font-medium tracking-wide">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-black hover:text-white transition-colors border-b border-cyan-400/30 pb-0.5"
          >
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </div>
  );
}
