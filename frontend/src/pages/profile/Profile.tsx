import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiGet, apiPost, API_BASE } from "../../service/api";

import type { UserProfile } from "./types";

type UpdateUserResponse = { message: string; user: UserProfile };
import ProfileSection from "./ProfileSection";
import ProfileField from "./ProfileField";
import LocationCard from "../locations/LocationCard";

interface Country {
  id: number;
  name: string;
  code: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ================= BOOKING HISTORY =================
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    apiGet<any>(`/my-bookings?user_id=${user.id}`)
      .then((data) => {
        console.log("[Profile] my-bookings API response:", data);
        const list = data.data ?? data;
        setRecentBookings(Array.isArray(list) ? list.slice(0, 3) : []);
      })
      .catch(() => setRecentBookings([]));
  }, []);

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
  const [favLocations, setFavLocations] = useState<any[]>([]);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  // ================= LOAD COUNTRIES =================
  useEffect(() => {
    apiGet<Country[]>("/countries")
      .then((data) => setCountries(data))
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  // ================= LOAD FAVORITES =================
  useEffect(() => {
    const favIds: number[] = JSON.parse(
      localStorage.getItem("favorite_locations") || "[]",
    );
    if (favIds.length > 0) {
      apiGet<any>("/locations")
        .then((data) => {
          const list = data.data ?? data;
          setFavLocations(
            list.filter((loc: any) => favIds.includes(loc.id)).slice(0, 2),
          );
        })
        .catch(console.error);
    }
  }, []);

  // ================= LOAD PROFILE =================
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
      .catch(() => {
        if (!localStorage.getItem("user")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // ================= SAVE =================
  const handleSave = async () => {
    if (!user) return;

    const formData = new FormData();

    // DB NOT NULL
    formData.append("name", form.name);

    if (form.phone) formData.append("phone", form.phone);
    if (form.date_of_birth)
      formData.append("date_of_birth", form.date_of_birth);
    if (form.passport_number)
      formData.append("passport_number", form.passport_number);
    if (form.country_id) formData.append("country_id", form.country_id);
    if (form.gender) formData.append("gender", form.gender);
    if (avatarFile) formData.append("avatar", avatarFile);

    // Laravel PUT + FormData
    formData.append("_method", "PUT");

    try {
      const updated = await apiPost<UpdateUserResponse>(
        `/users/${user.id}`,
        formData,
        true,
      );

      const updatedUser = updated.user;
      setUser(updatedUser);
      setEdit(false);
      setAvatarFile(null);
      setPreview(null);

      setForm({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        passport_number: updatedUser.passport_number || "",
        date_of_birth: updatedUser.date_of_birth
          ? updatedUser.date_of_birth.split("T")[0]
          : "",
        country_id: updatedUser.country?.id
          ? String(updatedUser.country.id)
          : "",
        gender: updatedUser.gender || "",
      });

      // 🔥 CẬP NHẬT LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAvatarVersion(Date.now()); // Force refresh the image by busting browser cache
      window.dispatchEvent(new Event("userProfileUpdated")); // Notify Header to update
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật thông tin");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await apiPost("/logout", {});
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!user) return null;

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 bg-white rounded-xl shadow px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold text-sky-700">
              My Travel Profile
            </h1>
            <p className="text-sm text-gray-500">
              Manage your personal travel information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow"
            >
              🏠 Home
            </button>

            <button
              onClick={() => navigate("/bookings")}
              className="bg-white border border-sky-500 text-sky-600 hover:bg-sky-50 px-5 py-2 rounded-full text-sm font-semibold"
            >
              📜 Lịch sử đặt
            </button>

            <button
              onClick={() => navigate("/favorites")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow"
            >
              Xem tất cả mục yêu thích ❤️
            </button>

            <button
              onClick={() => {
                setEdit(!edit);
                setAvatarFile(null);
                setPreview(null);
              }}
              className="border border-sky-500 text-sky-600 hover:bg-sky-50 px-5 py-2 rounded-full text-sm font-semibold"
            >
              {edit ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT - AVATAR */}
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow p-8 text-center">
            <img
              src={
                preview ||
                (user.avatar_url
                  ? `${API_BASE.replace("/api", "/storage")}/${user.avatar_url}?v=${avatarVersion}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0284c7&color=fff&size=200`)
              }
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-sky-100"
              alt="Avatar"
            />

            {edit && (
              <label className="inline-block mt-4 text-sm text-sky-600 font-medium cursor-pointer">
                Change avatar
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

            <h2 className="mt-5 text-xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">
              🌍 {user.country?.name || "Traveller"}
            </p>
          </div>

          {/* RIGHT - INFO */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8">
            {/* PERSONAL INFO */}
            <ProfileSection title="✈ Personal Information">
              <ProfileField
                label="Full Name"
                value={form.name}
                edit={edit}
                onChange={(v) => setForm({ ...form, name: v })}
              />

              <ProfileField
                label="Date of Birth"
                type="date"
                value={form.date_of_birth}
                edit={edit}
                onChange={(v) => setForm({ ...form, date_of_birth: v })}
              />

              {/* GENDER */}
              <div className="py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                {edit ? (
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {form.gender === "male"
                      ? "Nam"
                      : form.gender === "female"
                        ? "Nữ"
                        : form.gender === "other"
                          ? "Khác"
                          : "-"}
                  </p>
                )}
              </div>

              <ProfileField
                label="Passport Number"
                value={form.passport_number}
                edit={edit}
                onChange={(v) => setForm({ ...form, passport_number: v })}
              />

              {/* NATIONALITY - Dropdown when editing */}
              <div className="py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Nationality
                </p>
                {edit ? (
                  <select
                    value={form.country_id}
                    onChange={(e) =>
                      setForm({ ...form, country_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{user.country?.name || "-"}</p>
                )}
              </div>
            </ProfileSection>

            {/* CONTACT */}
            <ProfileSection title="📞 Contact Details">
              <ProfileField label="Email" value={user.email} />

              <ProfileField
                label="Phone"
                value={form.phone}
                edit={edit}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </ProfileSection>

            {/* ...đã xóa nút xem lịch sử đặt... */}

            {/* ...đã di chuyển nút mục yêu thích lên header... */}

            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-8">
              {edit && (
                <button
                  onClick={handleSave}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold shadow"
                >
                  💾 Save Changes
                </button>
              )}

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
