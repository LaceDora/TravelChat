import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationService from "../../services/LocationService";

export default function LocationsList() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<any[]>([]);

  const fetchLocations = async () => {
    try {
      const data = await LocationService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;

    try {
      await LocationService.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Locations</h1>

        <button
          onClick={() => navigate("/admin/locations/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Location
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-fixed border">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="border p-2 w-16">ID</th>
              <th className="border p-2 w-32">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2 w-32">Type</th>
              <th className="border p-2 w-32">Country</th>
              <th className="border p-2 w-32">Address</th>
              <th className="border p-2 w-32">Province</th>
              <th className="border p-2 w-32">Content</th>
              <th className="border p-2 w-32">Description</th>
              <th className="border p-2 w-20">Views</th>
              <th className="border p-2 w-40">Action</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50">
                {/* ID */}
                <td className="border p-2 text-center">{location.id}</td>
                {/* IMAGE */}
                <td className="border p-2 text-center">
                  {location.image_url ? (
                    <img
                      src={location.image_url}
                      alt={location.name}
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
                {/* NAME */}
                <td className="border p-2 truncate">{location.name}</td>
                {/* TYPE */}
                <td className="border p-2 text-center">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {location.type}
                  </span>
                </td>
                {/* COUNTRY */}
                <td className="border p-2 text-center">
                  {location.country?.name || location.country_id}
                </td>
                {/* ADDRESS */}
                <td className="border p-2 text-center">{location.address}</td>
                {/* PROVINCE */}
                <td className="border p-2 text-center">{location.province}</td>
                {/* CONTENT */}
                <td className="border p-2 text-center truncate">
                  {location.content}
                </td>
                {/* DESCRIPTION */}
                <td className="border p-2 text-center truncate">
                  {location.description}
                </td>
                {/* VIEWS */}
                <td className="border p-2 text-center">
                  {location.views_count}
                </td>
                {/* ACTION */}
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/locations/edit/${location.id}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
