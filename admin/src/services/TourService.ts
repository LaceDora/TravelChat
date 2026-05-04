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

  async getTours() {
    return request(`${API_URL}/tours`);
  },

  async getTour(id: number) {
    return request(`${API_URL}/tours/${id}`);
  },

  async createTour(data: any) {
    return request(`${API_URL}/tours`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateTour(id: number, data: any) {
    return request(`${API_URL}/tours/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteTour(id: number) {
    return request(`${API_URL}/tours/${id}`, {
      method: "DELETE",
    });
  },

  /* ===================== TOUR SCHEDULES ===================== */

  async getSchedulesByTour(tourId: number) {
    return request(`${API_URL}/tours/${tourId}/schedules`);
  },

  async getSchedule(id: number) {
    return request(`${API_URL}/tour-schedules/${id}`);
  },

  async createSchedule(data: any) {
    return request(`${API_URL}/tour-schedules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSchedule(id: number, data: any) {
    return request(`${API_URL}/tour-schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteSchedule(id: number) {
    return request(`${API_URL}/tour-schedules/${id}`, {
      method: "DELETE",
    });
  },

  /* ===================== TOUR DEPARTURES ===================== */

  // GET ALL DEPARTURES BY TOUR
  async getDeparturesByTour(tourId: number) {
    return request(`${API_URL}/tours/${tourId}/departures`);
  },

  // GET ONE DEPARTURE
  async getDeparture(id: number) {
    return request(`${API_URL}/tour-departures/${id}`);
  },

  // CREATE DEPARTURE
  async createDeparture(data: any) {
    return request(`${API_URL}/tour-departures`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE DEPARTURE
  async updateDeparture(id: number, data: any) {
    return request(`${API_URL}/tour-departures/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE DEPARTURE
  async deleteDeparture(id: number) {
    return request(`${API_URL}/tour-departures/${id}`, {
      method: "DELETE",
    });
  },
};

export default TourService;
