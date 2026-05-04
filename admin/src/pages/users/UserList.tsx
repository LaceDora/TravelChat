import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService, { User } from "../../services/UserService";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await UserService.getUsers();
      setUsers(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Xóa người dùng này?")) return;
    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Người dùng
            </h1>
            <p className="text-xs text-gray-400">{users.length} người dùng</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/users/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                <th className="px-5 py-3.5 text-left">ID</th>
                <th className="px-5 py-3.5 text-left">Tên</th>
                <th className="px-5 py-3.5 text-left">Email</th>
                <th className="px-5 py-3.5 text-left">SĐT</th>
                <th className="px-5 py-3.5 text-left">Ngày sinh</th>
                <th className="px-5 py-3.5 text-left">Quốc gia</th>
                <th className="px-5 py-3.5 text-left">Vai trò</th>
                <th className="px-5 py-3.5 text-center">Avatar</th>
                <th className="px-5 py-3.5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-500">{user.id}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.phone || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.country?.name || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        user.role === "admin"
                          ? "bg-violet-100 text-violet-600"
                          : "bg-sky-100 text-sky-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {user.avatar_url ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                        className="w-9 h-9 rounded-full object-cover mx-auto ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 text-xs font-bold">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    Chưa có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
