import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { User } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  const loadUser = () => {
    try {
      const stored = localStorage.getItem("user");
      // Kiểm tra kỹ: null, rỗng, hoặc chữ "undefined"
      if (!stored || stored === "undefined" || stored === "null") {
        setUser(null);
        return;
      }
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        setUser(parsed);
      }
    } catch (e) {
      console.error("Lỗi parse JSON user:", e);
      setUser(null);
      // Nếu dữ liệu rác, xóa luôn để lần sau không lỗi
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userProfileUpdated", loadUser);
    // Lắng nghe thêm sự kiện storage để đồng bộ nếu mở nhiều tab
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("userProfileUpdated", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              Travel<span className="text-blue-600">SE</span>
            </span>
          </Link>

          <Navbar />

          <div className="flex items-center gap-4">
            {/* Thêm check user?.id để chắc chắn user tồn tại */}
            {user && user.id ? (
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:bg-blue-50 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 overflow-hidden">
                  {user.avatar_url ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                      className="w-full h-full object-cover"
                      alt="avatar"
                      onError={(e) => {
                        (e.target as any).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=2563eb&color=fff`;
                      }}
                    />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-slate-500 font-medium">
                    Xin chào,
                  </p>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {user.name}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                <User size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
