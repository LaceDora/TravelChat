import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

export default function TourScheduleCreate() {
  const { id } = useParams(); // tour id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    day_number: "",
    title: "",
    activity: "",
  });

  const [loading, setLoading] = useState(false);
  const [tourName, setTourName] = useState("");

  useEffect(() => {
    if (id) {
      fetchTourName();
    }
  }, [id]);

  async function fetchTourName() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name || "");
    } catch (error) {
      setTourName("");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    setLoading(true);

    try {
      await TourService.createSchedule({
        tour_id: Number(id),
        day_number: Number(formData.day_number),
        title: formData.title,
        activity: formData.activity,
      });

      alert("Schedule created successfully!");

      navigate(`/admin/tours/${id}/schedules`);
    } catch (error) {
      console.error("Create schedule failed:", error);
      alert("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col mb-6 items-start">
      <h1 className="text-2xl font-bold mb-4">Tour Schedule: {tourName}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label className="block mb-1 font-medium">Day Number</label>
          <input
            type="number"
            name="day_number"
            value={formData.day_number}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Example: 1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Example: Visit Ba Na Hills"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Activity</label>
          <textarea
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border p-2 rounded"
            placeholder="Describe activities for this day..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}
