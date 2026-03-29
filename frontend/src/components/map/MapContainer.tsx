import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapItem {
  id: number;
  title: string;
  type: "hotel" | "restaurant" | "location";
  lat: number;
  lng: number;
}

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  const [items, setItems] = useState<MapItem[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [filter, setFilter] = useState<"all" | MapItem["type"]>("all");

  // load data
  useEffect(() => {
    fetch("http://localhost:8000/api/map-items")
      .then((r) => r.json())
      .then((r) => setItems(r.data || []));
  }, []);

  // init map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = L.map(mapRef.current).setView([10.775, 106.7], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.current,
    );

    markerLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos: [number, number] = [p.coords.latitude, p.coords.longitude];
        setUserPos(pos);

        if (map.current) {
          L.circleMarker(pos, {
            radius: 8,
            color: "#2563eb",
            fillColor: "#2563eb",
            fillOpacity: 1,
          })
            .bindPopup("Bạn đang ở đây")
            .addTo(map.current);

          map.current.setView(pos, 14);
        }
      },
      () => {},
    );
  }, []);

  // render markers
  useEffect(() => {
    if (!markerLayer.current) return;
    markerLayer.current.clearLayers();

    items
      .filter((i) => filter === "all" || i.type === filter)
      .forEach((i) => {
        const color =
          i.type === "hotel"
            ? "#2563eb"
            : i.type === "restaurant"
              ? "#16a34a"
              : "#ef4444";

        L.circleMarker([i.lat, i.lng], {
          radius: 7,
          color,
          fillColor: color,
          fillOpacity: 0.9,
        })
          .bindPopup(
            `<strong>${i.title}</strong><br/>
             <a href="/${i.type}/${i.id}">Xem chi tiết</a>`,
          )
          .addTo(markerLayer.current!);
      });
  }, [items, filter]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      {/* FILTER */}
      <div className="absolute z-[1000] top-3 left-3 bg-white rounded-lg p-2 flex gap-2">
        {["all", "hotel", "restaurant", "location"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`px-3 py-1 text-sm rounded ${
              filter === t ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LOCATE */}
      <button
        onClick={() => userPos && map.current?.setView(userPos, 15)}
        className="absolute z-[1000] bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Vị trí tôi
      </button>

      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapContainer;
