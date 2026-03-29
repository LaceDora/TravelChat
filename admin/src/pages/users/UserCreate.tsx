import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";

export default function UserCreate() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    date_of_birth: "",
    country_id: "",
    avatar_url: "",
  });

  // load countries
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
    fetchCountries();
  }, []);

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
      await UserService.createUser({
        ...form,
        country_id: form.country_id ? Number(form.country_id) : undefined,
        role: form.role === "admin" ? "admin" : "user",
      });

      alert("Create success");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Create User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* ROLE */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date_of_birth"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* COUNTRY DROPDOWN */}
        <select
          name="country_id"
          value={form.country_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          name="avatar_url"
          placeholder="Avatar URL"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
