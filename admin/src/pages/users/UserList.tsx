import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService, { User } from "../../services/UserService";

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

    if (!confirm("Delete this user?")) return;

    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>

        <button
          onClick={() => navigate("/admin/users/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Date of Birth</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Avatar</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>

              <td className="border p-2">{user.name}</td>

              <td className="border p-2">{user.email}</td>

              <td className="border p-2">{user.phone}</td>

              <td className="border p-2">{user.date_of_birth}</td>

              <td className="border p-2">{user.country?.name}</td>
              <td className="border p-2">{user.role}</td>

              <td className="border p-2">
                {user.avatar_url && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
