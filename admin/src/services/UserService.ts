const API_URL = "http://localhost:8000/api/admin/users";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  phone?: string;
  date_of_birth?: string;
  country_id?: number;
  avatar_url?: string;
  country?: {
    name: string;
  };
}

const UserService = {
  async getUsers() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch users");

    return res.json();
  },

  async getUser(id: number) {
    const res = await fetch(`${API_URL}/${id}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    return res.json();
  },

  async createUser(user: User) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Create failed");

    return res.json();
  },

  async updateUser(id: number, user: User) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Update failed");

    return res.json();
  },

  async deleteUser(id: number) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Delete failed");

    return res.json();
  },
};

export default UserService;
