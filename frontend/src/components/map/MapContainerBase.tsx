import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// import routing machine
// leaflet + OpenStreetMap
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface MapItem {
  id: number;
  title: string;
  type: string;
  lat: number;
  lng: number;
}

const MapContainerBase = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routingRef = useRef<any>(null); // 👈 ép any để TS không lỗi

  const [items, setItems] = useState<MapItem[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // 📍 Load map items
  useEffect(() => {
    fetch("http://localhost:8000/api/map-items")
      .then((res) => res.json())
      .then((res) => setItems(res.data || []));
  }, []);

  // 📍 Lấy vị trí user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => console.warn("Không lấy được vị trí user"),
    );
  }, []);

  // 🗺️ Khởi tạo map Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [10.775, 106.7],
      zoom: 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(mapInstance.current);

    markersRef.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // 👤 Marker vị trí user
  useEffect(() => {
    if (!mapInstance.current || !userPos || !markersRef.current) return;

    L.marker(userPos).bindPopup("Vị trí của bạn").addTo(markersRef.current);
  }, [userPos]);

  // 📌 Marker địa điểm + chỉ đường
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current || !userPos) return;

    markersRef.current.clearLayers();

    items.forEach((item) => {
      if (!item.lat || !item.lng) return;

      const marker = L.marker([item.lat, item.lng]).addTo(markersRef.current!);

      marker.bindPopup(`
        <strong>${item.title}</strong><br/>
        <small>${item.type}</small><br/><br/>
        <button id="walk-${item.id}">🚶 Đi bộ</button>
        <button id="drive-${item.id}">🏍️ Xe máy</button>
      `);

      marker.on("popupopen", () => {
        const walkBtn = document.getElementById(`walk-${item.id}`);
        const driveBtn = document.getElementById(`drive-${item.id}`);

        const drawRoute = (profile: "foot" | "car") => {
          if (routingRef.current) {
            mapInstance.current?.removeControl(routingRef.current);
          }

          routingRef.current = (L as any).Routing.control({
            waypoints: [
              L.latLng(userPos[0], userPos[1]),
              L.latLng(item.lat, item.lng),
            ],
            router: (L as any).Routing.osrmv1({
              serviceUrl: "https://router.project-osrm.org/route/v1",
              profile: profile === "foot" ? "foot" : "car",
            }),
            addWaypoints: false,
            routeWhileDragging: false,
            show: false,
          }).addTo(mapInstance.current!);
        };

        walkBtn && (walkBtn.onclick = () => drawRoute("foot"));
        driveBtn && (driveBtn.onclick = () => drawRoute("car"));
      });
    });
  }, [items, userPos]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    />
  );
};

export default MapContainerBase;
