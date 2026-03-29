import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TourService from "../../services/TourService";

interface Tour {
  id: number;
  location_id: number;
  name: string;
  days: number;
  price: number;
  discount_percent: number;
  image_url?: string;
  location?: {
    id: number;
    name: string;
  };
}

export default function TourList() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    try {
      const data = await TourService.getTours();
      setTours(data);
    } catch (error) {
      console.error("Error loading tours:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this tour?")) return;

    try {
      await TourService.deleteTour(id);
      setTours(tours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  // pagination
  const indexOfLast = currentPage * toursPerPage;
  const indexOfFirst = indexOfLast - toursPerPage;
  const currentTours = tours.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tours.length / toursPerPage);

  if (loading) return <p className="p-6">Loading tours...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tour Management</h1>

        <Link
          to="/admin/tours/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Tour
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border">Days</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentTours.map((tour) => (
              <tr key={tour.id} className="text-center">
                <td className="p-2 border">{tour.id}</td>
                <td className="border p-2 text-center">
                  {tour.image_url ? (
                    <img
                      src={tour.image_url}
                      alt={tour.name}
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
                <td className="p-2 border">{tour.name}</td>
                <td className="p-2 border">{tour.location?.name || '-'}</td>
                <td className="p-2 border">{tour.days}</td>
                <td className="p-2 border">{typeof tour.price === 'number' ? `$${tour.price.toLocaleString()}` : '-'}</td>
                <td className="p-2 border">{tour.discount_percent}%</td>
                <td className="p-2 border space-x-2">
                  <Link
                    to={`/admin/tours/edit/${tour.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/admin/tours/${tour.id}/schedules`}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Schedule
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
