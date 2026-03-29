import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HotelService from "../../services/HotelService";

interface Hotel {
  id: number;
  location_id: number | null;
  name: string;
  rating?: number | null;
  price_per_night: number;
  discount_percent: number | null;
  image_url?: string | null;
  address?: string | null;
  combo_content?: string | null;
  description?: string | null;
  location?: { id: number; name: string } | null;
}

export default function HotelsList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await HotelService.getHotels();
      setHotels(data);
    } catch (error) {
      console.error(error);
      alert("Cannot load hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hotel?")) return;

    try {
      await HotelService.deleteHotel(id);
      setHotels(hotels.filter((h) => h.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading hotels...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Hotels</h1>

        <Link
          to="/admin/hotels/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Hotel
        </Link>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Combo</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td className="border p-2 text-center">{hotel.id}</td>
              <td className="border p-2 text-center">
                {hotel.image_url ? (
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    style={{
                      width: "110px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      margin: "auto",
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </td>
              <td className="border p-2">{hotel.name}</td>
              <td className="border p-2">
                {hotel.location && hotel.location.name
                  ? hotel.location.name
                  : "N/A"}
              </td>
              <td className="border p-2">
                {hotel.rating !== null && hotel.rating !== undefined
                  ? hotel.rating
                  : "N/A"}
              </td>
              <td className="border p-2">${hotel.price_per_night}</td>
              <td className="border p-2">
                {hotel.discount_percent !== null &&
                hotel.discount_percent !== undefined
                  ? hotel.discount_percent + "%"
                  : "N/A"}
              </td>
              <td className="border p-2">{hotel.address ?? "N/A"}</td>
              <td className="border p-2">{hotel.combo_content ?? ""}</td>
              <td className="border p-2">{hotel.description ?? ""}</td>
              <td className="border p-2 flex gap-2">
                {/* ROOMS BUTTON */}
                <Link
                  to={`/admin/hotels/${hotel.id}/rooms`}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Rooms
                </Link>
                <Link
                  to={`/admin/hotels/edit/${hotel.id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(hotel.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {hotels.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center p-4">
                No hotels found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
