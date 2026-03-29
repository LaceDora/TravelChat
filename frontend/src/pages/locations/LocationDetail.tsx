import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
// ================= ICON =================
const defaultIcon = getIconByType("location");

/* ================= AUTO ZOOM ================= */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [points]);
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

  /* ================= LOAD LOCATION ================= */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/locations/${id}`)
      .then((r) => r.json())
      .then((r) => {
        setData(r);
        setLoading(false);
      });
  }, [id]);

  // Lấy vị trí user chỉ khi bấm chỉ đường
  useEffect(() => {
    if (!showDirection) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Không lấy được vị trí của bạn"),
    );
  }, [showDirection]);

  // Lấy route khi showDirection và có userPos
  useEffect(() => {
    if (!showDirection || !userPos || !data?.lat || !data?.lng) return;

    fetch(`https://api.openrouteservice.org/v2/directions/${mode}/geojson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjIzYzZlZThmOWQ3MzRlMGVhODc3YzAyZTdiZDFkNTUyIiwiaCI6Im11cm11cjY0In0=",
      },
      body: JSON.stringify({
        coordinates: [
          [userPos[1], userPos[0]],
          [Number(data.lng), Number(data.lat)],
        ],
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        const feature = r.features[0];

        const coords = feature.geometry.coordinates.map((c: number[]) => [
          c[1],
          c[0],
        ]);

        setRoute(coords);
        setDistance(feature.properties.summary.distance / 1000);
        setDuration(feature.properties.summary.duration / 60);
      });
  }, [showDirection, userPos, data, mode]);

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

      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
      <p className="text-gray-700 mb-6">{data.description}</p>

      {/* ================= NÚT CHỈ ĐƯỜNG ================= */}
      {!showDirection && (
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowDirection(true)}
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
                className={`px-4 py-2 rounded ${
                  mode === m ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
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

      {/* ================= MAP ================= */}
      <div className="w-full h-[420px] rounded-2xl overflow-hidden mb-10">
        <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[lat, lng]} icon={defaultIcon}>
            <Popup>{data.name}</Popup>
          </Marker>

          {/* Hiện user, route, fitbounds chỉ khi showDirection */}
          {showDirection && userPos && (
            <Marker position={userPos} icon={getIconByType("user")}>
              <Popup>Vị trí của bạn</Popup>
            </Marker>
          )}

          {showDirection && route.length > 0 && (
            <Polyline positions={route} color="red" weight={5} />
          )}

          {showDirection && userPos && (
            <FitBounds points={[userPos, [lat, lng]]} />
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
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg"
              >
                <img src={loc.image_url} className="w-full h-40 object-cover" />
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
            {/* HOTELS */}
            {data.hotels?.map((item: any) => (
              <a
                key={`hotel-${item.id}`}
                href={`/services/hotel/${item.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image_url}
                  className="w-full h-40 object-cover"
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

            {/* RESTAURANTS */}
            {data.restaurants?.map((item: any) => (
              <a
                key={`restaurant-${item.id}`}
                href={`/services/restaurant/${item.id}`}
                className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image_url}
                  className="w-full h-40 object-cover"
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
