import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TourService from "../../services/TourService";

interface Schedule {
  id: number;
  tour_id: number;
  day_number: number;
  title: string;
  activity: string;
}

export default function TourScheduleList() {
  const { id } = useParams(); // tour id

  const [tourName, setTourName] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSchedules();
      fetchTour();
    }
  }, [id]);

  async function fetchTour() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name);
    } catch (error) {
      console.error("Load tour failed:", error);
    }
  }

  async function fetchSchedules() {
    try {
      const data = await TourService.getSchedulesByTour(Number(id));
      setSchedules(data);
    } catch (error) {
      console.error("Load schedules failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(scheduleId: number) {
    if (!confirm("Delete this schedule?")) return;

    try {
      await TourService.deleteSchedule(scheduleId);

      setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  if (loading) return <p className="p-6">Loading schedules...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Tour Schedule: {tourName}</h1>

        <Link
          to={`/admin/tours/${id}/schedules/create`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Schedule
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Day</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Activity</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="text-center">
                <td className="p-2 border">Day {schedule.day_number}</td>

                <td className="p-2 border">{schedule.title}</td>

                <td className="p-2 border text-left">{schedule.activity}</td>

                <td className="p-2 border space-x-2">
                  <Link
                    to={`/admin/tours/${id}/schedules/edit/${schedule.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {schedules.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No schedules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
