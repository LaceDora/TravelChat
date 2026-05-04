import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import Breadcrumb from "../../components/common/Breadcrumb";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getIconByType } from "../../components/map/mapIcons";
import { Eye, Globe } from "lucide-react";

// ================= ICON =================
const defaultIcon = getIconByType("location");

/* ================= CỨU TINH MAP (FIX MẢNG XÁM) ================= */
function MapHandler({
  points,
  showDirection,
}: {
  points: [number, number][];
  showDirection: boolean;
}) {
  const map = useMap();

  // Fix lỗi mảng xám khi map hiển thị/thay đổi kích thước
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map, showDirection]);

  // Tự động căn chỉnh khung hình khi có lộ trình
  useEffect(() => {
    if (showDirection && points.length >= 2) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [points, map, showDirection]);

  return null;
}

type TravelMode = "foot-walking" | "cycling-regular" | "driving-car";

/* ================= PAGE ================= */
export default function LocationDetail() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [mode, setMode] = useState<TravelMode>("foot-walking");
  const [showDirection, setShowDirection] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch location data
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/locations/${id}`)
      .then((r) => r.json())
      .then((r) => {
        setData(r);
        setLoading(false);
      });
  }, [id]);

  // Logic lấy đường đi thực tế từ API OSRM
  const fetchRoute = useCallback(
    async (
      start: [number, number],
      end: [number, number],
      travelMode: TravelMode,
    ) => {
      const osrmMode =
        travelMode === "foot-walking"
          ? "foot"
          : travelMode === "driving-car"
            ? "car"
            : "bicycle";
      const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const result = await res.json();
        if (result.routes && result.routes.length > 0) {
          const r = result.routes[0];
          setRoute(r.geometry.coordinates.map((c: any) => [c[1], c[0]]));
          setDistance(r.distance / 1000); // km
          setDuration(r.duration / 60); // phút
        }
      } catch (err) {
        console.error("Lỗi lấy đường đi:", err);
      }
    },
    [],
  );

  // Xử lý khi bấm nút Chỉ đường
  const handleGetDirection = () => {
    if (!navigator.geolocation)
      return alert("Trình duyệt không hỗ trợ định vị");

    navigator.geolocation.getCurrentPosition((pos) => {
      const uPos: [number, number] = [
        pos.coords.latitude,
        pos.coords.longitude,
      ];
      setUserPos(uPos);
      setShowDirection(true);
      if (data) fetchRoute(uPos, [Number(data.lat), Number(data.lng)], mode);
    });
  };

  // Cập nhật lại đường đi khi đổi phương tiện
  useEffect(() => {
    if (showDirection && userPos && data) {
      fetchRoute(userPos, [Number(data.lat), Number(data.lng)], mode);
    }
  }, [mode, showDirection, userPos, data, fetchRoute]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!data) return <p className="text-center py-20">Not found</p>;

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Địa điểm", path: "/locations" },
          { label: data.name },
        ]}
      />

      {/* Hình ảnh nổi bật */}
      {data.image_url && (
        <div className="mb-6 w-full max-h-[400px] rounded-2xl overflow-hidden flex justify-center">
          <img
            src={data.image_url}
            alt={data.name}
            className="object-cover w-full max-h-[400px]"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900">{data.name}</h1>

        <div className="flex flex-wrap gap-3 items-center text-sm">
          {/* Quốc gia */}
          {data.country?.name && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium">
              <Globe size={14} className="text-blue-500" />
              Quốc gia: <b className="text-slate-900">{data.country.name}</b>
            </span>
          )}

          {/* Lượt xem - Thay icon 👁 bằng Eye icon */}
          {data.views_count !== undefined && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium">
              <Eye size={14} className="text-slate-500" />
              <b className="text-slate-900">
                {data.views_count.toLocaleString()}
              </b>{" "}
              lượt xem
            </span>
          )}
        </div>
      </div>

      {/* Địa chỉ, tỉnh */}
      {(data.address || data.province) && (
        <div className="mb-2 text-gray-700">
          {data.address && <span>📍 {data.address}</span>}
          {data.province && (
            <span>
              {data.address ? ", " : "📍 "} {data.province}
            </span>
          )}
        </div>
      )}

      {/* Ngày tạo, cập nhật */}
      <div className="mb-2 text-xs text-gray-400">
        {data.created_at && (
          <span>Ngày tạo: {formatDate(data.created_at)}</span>
        )}
        {data.updated_at && (
          <span className="ml-4">Cập nhật: {formatDate(data.updated_at)}</span>
        )}
      </div>

      {/* Mô tả & Nội dung */}
      {data.description && (
        <p className="text-gray-700 mb-4">{data.description}</p>
      )}
      {data.content && (
        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      )}

      {/* ================= NÚT CHỈ ĐƯỜNG ================= */}
      {!showDirection && (
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleGetDirection}
        >
          🧭 Chỉ đường đến đây
        </button>
      )}

      {/* ================= MODE & THÔNG TIN CHỈ ĐƯỜNG ================= */}
      {showDirection && (
        <>
          <div className="flex gap-3 mb-4">
            {[
              ["foot-walking", "🚶 Đi bộ"],
              ["cycling-regular", "🏍 Xe máy"],
              ["driving-car", "🚗 Ô tô"],
            ].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m as TravelMode)}
                className={`px-4 py-2 rounded transition ${mode === m ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {distance && duration && (
            <p className="mb-4 text-gray-700">
              📏 <b>{distance.toFixed(1)} km</b> – ⏱{" "}
              <b>{Math.round(duration)} phút</b>
            </p>
          )}
        </>
      )}

      {/* ================= MAP (ĐÃ FIX) ================= */}
      <div className="w-full h-[450px] rounded-2xl overflow-hidden mb-10 shadow-inner border border-gray-200">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Component xử lý fix mảng xám và auto zoom */}
          <MapHandler
            points={userPos ? [userPos, [lat, lng]] : []}
            showDirection={showDirection}
          />

          <Marker position={[lat, lng]} icon={defaultIcon}>
            <Popup>{data.name}</Popup>
          </Marker>

          {showDirection && userPos && (
            <Marker position={userPos} icon={getIconByType("user")}>
              <Popup>Vị trí của bạn</Popup>
            </Marker>
          )}

          {showDirection && route.length > 0 && (
            <Polyline
              positions={route}
              color="#2563eb"
              weight={5}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      {/* ================= RELATED LOCATIONS ================= */}
      {data.related_locations?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">📍 Gợi ý địa điểm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {data.related_locations.map((loc: any) => (
              <a
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={loc.image_url}
                  className="w-full h-40 object-cover"
                  alt={loc.name}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{loc.name}</h3>
                  <p className="text-sm text-gray-500">{loc.address}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* ================= RELATED TOURS ================= */}
      {data.related_tours?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">🧳 Tour liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data.related_tours.map((tour: any) => (
              <a
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={tour.image_url}
                  className="w-full h-40 object-cover"
                  alt={tour.name}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{tour.name}</h3>
                  {tour.price && (
                    <p className="text-sm text-red-600 font-bold mt-1">
                      {Number(tour.price).toLocaleString()} đ
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* ================= SERVICES ================= */}
      {(data.hotels?.length > 0 || data.restaurants?.length > 0) && (
        <>
          <h2 className="text-2xl font-bold mb-4">🛎 Dịch vụ gần đây</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.hotels?.map((item: any) => (
              <a
                key={`hotel-${item.id}`}
                href={`/services/hotel/${item.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image_url}
                  className="w-full h-40 object-cover"
                  alt={item.name}
                />
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-semibold">
                    🏨 Khách sạn
                  </span>
                  <h3 className="font-semibold mt-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.address}</p>
                </div>
              </a>
            ))}
            {data.restaurants?.map((item: any) => (
              <a
                key={`restaurant-${item.id}`}
                href={`/services/restaurant/${item.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image_url}
                  className="w-full h-40 object-cover"
                  alt={item.name}
                />
                <div className="p-4">
                  <span className="text-xs text-green-600 font-semibold">
                    🍽 Nhà hàng
                  </span>
                  <h3 className="font-semibold mt-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.address}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
