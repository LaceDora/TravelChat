const API_URL = "http://127.0.0.1:8000/api/admin";

const DashboardService = {
  async getStats() {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }
    return await res.json();
  },
};

export default DashboardService;
