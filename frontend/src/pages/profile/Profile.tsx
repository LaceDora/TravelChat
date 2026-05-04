import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiGet, apiPost, API_BASE } from "../../service/api";
import {
  Home,
  History,
  Heart,
  UserPen,
  LogOut,
  Camera,
  Save,
  XCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";

import type { UserProfile } from "./types";
import ProfileSection from "./ProfileSection";
import ProfileField from "./ProfileField";

type UpdateUserResponse = { message: string; user: UserProfile };

interface Country {
  id: number;
  name: string;
  code: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date_of_birth: "",
    passport_number: "",
    country_id: "",
    gender: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  // ================= LOAD DATA =================
  useEffect(() => {
    apiGet<Country[]>("/countries")
      .then((data) => setCountries(data))
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(stored);
    if (String(currentUser.id) !== id) {
      navigate("/login");
      return;
    }

    apiGet<UserProfile>(`/users/${id}`)
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          passport_number: data.passport_number || "",
          date_of_birth: data.date_of_birth
            ? data.date_of_birth.split("T")[0]
            : "",
          country_id: data.country?.id ? String(data.country.id) : "",
          gender: data.gender || "",
        });
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // ================= SAVE =================
  const handleSave = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.phone) formData.append("phone", form.phone);
    if (form.date_of_birth)
      formData.append("date_of_birth", form.date_of_birth);
    if (form.passport_number)
      formData.append("passport_number", form.passport_number);
    if (form.country_id) formData.append("country_id", form.country_id);
    if (form.gender) formData.append("gender", form.gender);
    if (avatarFile) formData.append("avatar", avatarFile);
    formData.append("_method", "PUT");

    try {
      const updated = await apiPost<UpdateUserResponse>(
        `/users/${user.id}`,
        formData,
        true,
      );
      setUser(updated.user);
      setEdit(false);
      setAvatarFile(null);
      setPreview(null);
      localStorage.setItem("user", JSON.stringify(updated.user));
      setAvatarVersion(Date.now());
      window.dispatchEvent(new Event("userProfileUpdated"));
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật thông tin");
    }
  };

  const handleLogout = async () => {
    try {
      await apiPost("/logout", {});
    } catch (e) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Đang tải hồ sơ của bạn...</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Hồ sơ cá nhân
              </h1>
              <p className="text-slate-500 text-sm">
                Quản lý thông tin và bảo mật tài khoản
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-black transition-all"
            >
              <Home size={18} /> Trang chủ
            </button>
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              <History size={18} /> Lịch sử
            </button>
            <button
              onClick={() => navigate("/favorites")}
              className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all"
            >
              <Heart size={18} /> Yêu thích
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: AVATAR CARD */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="relative mt-4">
                <div className="w-36 h-36 mx-auto rounded-full p-1.5 bg-white shadow-xl">
                  <img
                    src={
                      preview ||
                      (user.avatar_url
                        ? `${API_BASE.replace("/api", "/storage")}/${user.avatar_url}?v=${avatarVersion}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0284c7&color=fff&size=200`)
                    }
                    className="w-full h-full rounded-full object-cover"
                    alt="Avatar"
                  />
                  {edit && (
                    <label className="absolute bottom-1 right-1/2 translate-x-1/2 lg:right-4 lg:translate-x-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            setAvatarFile(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-black text-slate-800">
                  {user.name}
                </h2>
                <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-1">
                  {user.country?.name || "Thành viên"}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setEdit(!edit);
                      setAvatarFile(null);
                      setPreview(null);
                    }}
                    className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${edit ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                  >
                    {edit ? (
                      <>
                        <XCircle size={18} /> Hủy chỉnh sửa
                      </>
                    ) : (
                      <>
                        <UserPen size={18} /> Chỉnh sửa hồ sơ
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 text-rose-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <LogOut size={18} /> Đăng xuất tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS FORM */}
          <div className="lg:col-span-8">
            <ProfileSection title="Thông tin cá nhân">
              <ProfileField
                label="Họ và tên"
                value={form.name}
                edit={edit}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <ProfileField
                label="Ngày sinh"
                type="date"
                value={form.date_of_birth}
                edit={edit}
                onChange={(v) => setForm({ ...form, date_of_birth: v })}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wider">
                  Giới tính
                </label>
                {edit ? (
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <div className="w-full h-12 px-4 flex items-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 font-semibold italic">
                    {form.gender === "male"
                      ? "Nam"
                      : form.gender === "female"
                        ? "Nữ"
                        : form.gender === "other"
                          ? "Khác"
                          : "Chưa cập nhật"}
                  </div>
                )}
              </div>

              <ProfileField
                label="Số hộ chiếu (Passport)"
                value={form.passport_number}
                edit={edit}
                onChange={(v) => setForm({ ...form, passport_number: v })}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wider">
                  Quốc tịch
                </label>
                {edit ? (
                  <select
                    value={form.country_id}
                    onChange={(e) =>
                      setForm({ ...form, country_id: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">-- Chọn quốc gia --</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full h-12 px-4 flex items-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 font-semibold uppercase tracking-tight">
                    {user.country?.name || "Chưa cập nhật"}
                  </div>
                )}
              </div>
            </ProfileSection>

            <ProfileSection title="Thông tin liên hệ">
              <ProfileField
                label="Địa chỉ Email"
                value={user.email}
                edit={false}
              />
              <ProfileField
                label="Số điện thoại"
                value={form.phone}
                edit={edit}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </ProfileSection>

            {edit && (
              <div className="mt-8 flex justify-end animate-in fade-in zoom-in duration-300">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 flex items-center gap-2 transform active:scale-95 transition-all"
                >
                  <Save size={20} /> Lưu thay đổi ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
