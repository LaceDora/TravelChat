import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

export default function TourScheduleEdit() {
  const { id, scheduleId } = useParams(); // id = tourId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    day_number: "",
    title: "",
    activity: "",
  });

  const [tourName, setTourName] = useState("");

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule();
    }
    if (id) {
      fetchTourName();
    }
  }, [scheduleId, id]);

  async function fetchTourName() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name || "");
    } catch (error) {
      setTourName("");
    }
  }
  async function fetchSchedule() {
    try {
      const data = await TourService.getSchedule(Number(scheduleId));

      setFormData({
        day_number: data.day_number || "",
        title: data.title || "",
        activity: data.activity || "",
      });
    } catch (error) {
      console.error("Load schedule failed:", error);
      alert("Failed to load schedule");
    } finally {
      setLoading(false);
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

    if (!scheduleId) return;

    setSaving(true);

    try {
      await TourService.updateSchedule(Number(scheduleId), {
        tour_id: Number(id),
        day_number: Number(formData.day_number),
        title: formData.title,
        activity: formData.activity,
      });

      alert("Schedule updated successfully!");

      navigate(`/admin/tours/${id}/schedules`);
    } catch (error) {
      console.error("Update schedule failed:", error);
      alert("Failed to update schedule");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading schedule...</p>;

  return (
    <div className="flex flex-col mb-6 items-start">
      <h1 className="text-2xl font-bold mb-4">EditTour: {tourName}</h1>

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
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          {saving ? "Updating..." : "Update Schedule"}
        </button>
      </form>
    </div>
  );
}
