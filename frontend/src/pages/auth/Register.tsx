import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiGet, apiPost } from "../../service/api";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Globe,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

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
    country_id: "",
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
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 relative overflow-hidden bg-slate-900">
      {/* NÚT QUAY LẠI */}
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

      {/* LAYER ẢNH NỀN (Đồng bộ với Login) */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-[10s] scale-110 hover:scale-100"
        style={{
          backgroundImage:
            "url('https://vmstyle.vn/wp-content/uploads/2025/09/hinh-nen-thien-nhien-hung-vi-nhat-the-gioi-nui-cao-va-thac-nuoc-4k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-brightness-90"></div>
      </div>

      {/* FORM ĐĂNG KÝ */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-[16px] rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 z-10 animate-in fade-in zoom-in duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            TẠO <span className="text-cyan-400">TÀI KHOẢN</span>
          </h1>
          <p className="text-slate-300 text-sm font-light">
            Gia nhập cộng đồng du lịch lớn nhất Đông Nam Á
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tên */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
                Họ và Tên
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={18}
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Quốc gia */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
                Quốc gia
              </label>
              <div className="relative group">
                <Globe
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={18}
                />
                <select
                  name="country_id"
                  value={form.country_id}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="text-slate-800">
                    Chọn quốc gia
                  </option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id} className="text-slate-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="yourmail@example.com"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[2px] ml-1">
                Xác nhận
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={18}
                />
                <input
                  name="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Điều khoản */}
          <label className="flex items-center gap-3 cursor-pointer group py-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
              />
              <div className="h-5 w-5 border-2 border-white/30 rounded flex items-center justify-center peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all">
                <CheckCircle2
                  size={14}
                  className="text-white opacity-0 peer-checked:opacity-100"
                />
              </div>
            </div>
            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
              Tôi đồng ý với{" "}
              <span className="text-cyan-400 font-bold underline">
                Điều khoản
              </span>{" "}
              và{" "}
              <span className="text-cyan-400 font-bold underline">
                Chính sách bảo mật
              </span>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-4 rounded-xl font-black shadow-[0_10px_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-400 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Tạo tài khoản ngay"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-white/40 text-xs font-medium">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-cyan-400 font-black hover:text-white transition-colors border-b border-cyan-400/30 pb-0.5"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
