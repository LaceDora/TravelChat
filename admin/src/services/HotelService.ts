const API_URL = "http://127.0.0.1:8000/api/admin";

const HotelService = {
  /* ===================== HOTEL ===================== */

  // GET ALL HOTELS
  async getHotels() {
    const res = await fetch(`${API_URL}/hotels`);

    if (!res.ok) {
      throw new Error("Failed to fetch hotels");
    }

    return await res.json();
  },

  // GET HOTEL BY ID
  async getHotel(id: number) {
    const res = await fetch(`${API_URL}/hotels/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch hotel");
    }

    return await res.json();
  },

  // CREATE HOTEL
  async createHotel(data: any) {
    const res = await fetch(`${API_URL}/hotels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Create hotel failed");
    }

    return await res.json();
  },

  // UPDATE HOTEL
  async updateHotel(id: number, data: any) {
    const res = await fetch(`${API_URL}/hotels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Update hotel failed");
    }

    return await res.json();
  },

  // DELETE HOTEL
  async deleteHotel(id: number) {
    const res = await fetch(`${API_URL}/hotels/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete hotel failed");
    }

    return true;
  },

  /* ===================== HOTEL ROOMS ===================== */

  // GET ROOMS BY HOTEL
  async getRoomsByHotel(hotelId: number) {
    const res = await fetch(`${API_URL}/hotels/${hotelId}/rooms`);

    if (!res.ok) {
      throw new Error("Failed to fetch rooms");
    }

    return await res.json();
  },

  // GET ROOM BY ID
  async getRoom(id: number) {
    const res = await fetch(`${API_URL}/hotel-rooms/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch room");
    }

    return await res.json();
  },

  // CREATE ROOM
  async createRoom(data: any) {
    const res = await fetch(`${API_URL}/hotel-rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Create room failed");
    }

    return await res.json();
  },

  // UPDATE ROOM
  async updateRoom(id: number, data: any) {
    const res = await fetch(`${API_URL}/hotel-rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Update room failed");
    }

    return await res.json();
  },

  // DELETE ROOM
  async deleteRoom(id: number) {
    const res = await fetch(`${API_URL}/hotel-rooms/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete room failed");
    }

    return true;
  },
};

export default HotelService;
