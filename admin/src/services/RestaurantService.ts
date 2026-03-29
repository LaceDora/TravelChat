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

const RestaurantService = {
  /* ===================== LOCATIONS ===================== */

  // GET ALL LOCATIONS
  async getLocations() {
    return request(`${API_URL}/locations`);
  },

  /* ===================== RESTAURANTS ===================== */

  // GET ALL RESTAURANTS
  async getRestaurants() {
    return request(`${API_URL}/restaurants`);
  },

  // GET RESTAURANT BY ID
  async getRestaurant(id: number) {
    return request(`${API_URL}/restaurants/${id}`);
  },

  // CREATE RESTAURANT
  async createRestaurant(data: any) {
    return request(`${API_URL}/restaurants`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE RESTAURANT
  async updateRestaurant(id: number, data: any) {
    return request(`${API_URL}/restaurants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE RESTAURANT
  async deleteRestaurant(id: number) {
    return request(`${API_URL}/restaurants/${id}`, {
      method: "DELETE",
    });
  },

  /* ===================== RESTAURANT TABLES ===================== */

  // GET TABLES BY RESTAURANT
  async getTablesByRestaurant(restaurantId: number) {
    return request(`${API_URL}/restaurants/${restaurantId}/tables`);
  },

  // GET TABLE BY ID
  async getTable(id: number) {
    return request(`${API_URL}/restaurant-tables/${id}`);
  },

  // CREATE TABLE
  async createTable(data: any) {
    return request(`${API_URL}/restaurant-tables`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE TABLE
  async updateTable(id: number, data: any) {
    return request(`${API_URL}/restaurant-tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE TABLE
  async deleteTable(id: number) {
    return request(`${API_URL}/restaurant-tables/${id}`, {
      method: "DELETE",
    });
  },
};

export default RestaurantService;
