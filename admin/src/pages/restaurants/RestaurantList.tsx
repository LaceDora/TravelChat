import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Load restaurants failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await RestaurantService.deleteRestaurant(id);
      loadRestaurants();
    } catch (error) {
      console.error("Delete restaurant failed:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading restaurants...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>

        <Link
          to="/admin/restaurants/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Restaurant
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
              <th className="p-3 border">Avg Price</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No restaurants found
                </td>
              </tr>
            )}

            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td className="border p-2 text-center">{restaurant.id}</td>
                <td className="border p-2 text-center">
                  {restaurant.image_url ? (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      style={{
                        width: "110px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        margin: "auto",
                      }}
                    />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="p-3 border font-medium">{restaurant.name}</td>
                <td className="p-3 border">
                  {restaurant.location?.name || "-"}
                </td>
                <td className="p-3 border">
                  {restaurant.avg_price ? `$${restaurant.avg_price}` : "-"}
                </td>
                <td className="p-3 border">
                  {restaurant.discount_percent || 0}%
                </td>
                <td className="p-3 border space-x-2">
                  <Link
                    to={`/admin/restaurants/edit/${restaurant.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/admin/restaurants/${restaurant.id}/tables`}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Tables
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
