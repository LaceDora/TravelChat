const API_URL = "http://127.0.0.1:8000/api/admin";

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  if (res.status === 204) return true;

  return res.json();
}

const TourService = {
  /* ===================== TOURS ===================== */

  // GET ALL TOURS
  async getTours() {
    return request(`${API_URL}/tours`);
  },

  // GET TOUR BY ID
  async getTour(id: number) {
    return request(`${API_URL}/tours/${id}`);
  },

  // CREATE TOUR
  async createTour(data: any) {
    return request(`${API_URL}/tours`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE TOUR
  async updateTour(id: number, data: any) {
    return request(`${API_URL}/tours/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE TOUR
  async deleteTour(id: number) {
    return request(`${API_URL}/tours/${id}`, {
      method: "DELETE",
    });
  },

  /* ===================== TOUR SCHEDULES ===================== */

  // GET SCHEDULES BY TOUR
  async getSchedulesByTour(tourId: number) {
    return request(`${API_URL}/tours/${tourId}/schedules`);
  },

  // GET SCHEDULE BY ID
  async getSchedule(id: number) {
    return request(`${API_URL}/tour-schedules/${id}`);
  },

  // CREATE SCHEDULE
  async createSchedule(data: any) {
    return request(`${API_URL}/tour-schedules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE SCHEDULE
  async updateSchedule(id: number, data: any) {
    return request(`${API_URL}/tour-schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE SCHEDULE
  async deleteSchedule(id: number) {
    return request(`${API_URL}/tour-schedules/${id}`, {
      method: "DELETE",
    });
  },
};

export default TourService;
