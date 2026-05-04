import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService, { User } from "../../services/UserService";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countries, setCountries] = useState<any[]>([]);

  const [form, setForm] = useState<
    Omit<User, "id" | "country_id"> & {
      country_id: string;
      gender: string;
      passport_number: string;
    }
  >({
    name: "",
    email: "",
    role: "user",
    phone: "",
    gender: "male",
    date_of_birth: "",
    passport_number: "",
    country_id: "",
    avatar_url: "",
  });

  const fetchUser = async () => {
    try {
      const data = await UserService.getUser(Number(id));
      setForm({
        name: data.name || "",
        email: data.email || "",
        role: (data.role as "user" | "admin") || "user",
        phone: data.phone || "",
        gender: data.gender || "male",
        date_of_birth: data.date_of_birth || "",
        passport_number: data.passport_number || "",
        country_id: data.country_id ? String(data.country_id) : "",
        avatar_url: data.avatar_url || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/countries");
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
    fetchCountries();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.updateUser(Number(id), {
        ...form,
        role: form.role as "user" | "admin",
        country_id: form.country_id ? Number(form.country_id) : undefined,
      });
      alert("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa người dùng</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* Tên & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        {/* Số điện thoại & Passport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <input
            name="passport_number"
            value={form.passport_number}
            onChange={handleChange}
            placeholder="Số hộ chiếu (Passport)"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Giới tính & Vai trò */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="user">Người dùng (User)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500 ml-1">Ngày sinh</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Quốc gia */}
        <select
          name="country_id"
          value={form.country_id}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">Chọn quốc gia</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        {/* Ảnh đại diện */}
        <input
          name="avatar_url"
          value={form.avatar_url}
          onChange={handleChange}
          placeholder="Đường dẫn ảnh đại diện (URL)"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        {/* Nút bấm */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
