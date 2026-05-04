import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import routing machine
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
  const routingRef = useRef<any>(null);

  const [items, setItems] = useState<MapItem[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // 1. Tải dữ liệu địa điểm
  useEffect(() => {
    fetch("http://localhost:8000/api/map-items")
      .then((res) => res.json())
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error("Lỗi fetch map items:", err));
  }, []);

  // 2. Lấy vị trí người dùng
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => console.warn("Không lấy được vị trí user"),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  // 3. Khởi tạo Bản đồ
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Khởi tạo instance
    mapInstance.current = L.map(mapRef.current, {
      center: [10.775, 106.7],
      zoom: 12,
      zoomControl: true,
    });

    // Thêm lớp bản đồ sáng (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    // FIX LỖI MẢNG XÁM: Ép bản đồ tính toán lại kích thước sau khi mount
    setTimeout(() => {
      mapInstance.current?.invalidateSize();
    }, 400);

    markersRef.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 4. Cập nhật Marker vị trí User
  useEffect(() => {
    if (!mapInstance.current || !userPos || !markersRef.current) return;

    const userIcon = L.divIcon({
      className: "user-location-icon",
      html: `<div style="background-color: #06b6d4; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    });

    L.marker(userPos, { icon: userIcon })
      .addTo(markersRef.current)
      .bindPopup("Vị trí của bạn")
      .openPopup();

    // Di chuyển tâm bản đồ về phía người dùng
    mapInstance.current.setView(userPos, 14);
  }, [userPos]);

  // 5. Marker địa điểm & Xử lý chỉ đường
  useEffect(() => {
    if (
      !mapInstance.current ||
      !markersRef.current ||
      !userPos ||
      items.length === 0
    )
      return;

    markersRef.current.clearLayers();

    items.forEach((item) => {
      if (!item.lat || !item.lng) return;

      const marker = L.marker([item.lat, item.lng]).addTo(markersRef.current!);

      // Tạo nội dung Popup kiểu Web hiện đại
      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <div style="font-family: sans-serif; padding: 5px;">
          <strong style="font-size: 14px;">${item.title}</strong><br/>
          <span style="color: #666; font-size: 12px;">${item.type}</span><br/><br/>
          <div style="display: flex; gap: 8px;">
            <button id="walk-${item.id}" style="background: #06b6d4; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">🚶 Đi bộ</button>
            <button id="drive-${item.id}" style="background: #1e293b; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">🏍️ Xe máy</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("popupopen", () => {
        const walkBtn = document.getElementById(`walk-${item.id}`);
        const driveBtn = document.getElementById(`drive-${item.id}`);

        const drawRoute = (profile: string) => {
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
            lineOptions: {
              styles: [
                {
                  color: profile === "foot" ? "#22c55e" : "#06b6d4",
                  weight: 6,
                },
              ],
              extendToWaypoints: true,
              missingRouteTolerance: 10,
            },
            addWaypoints: false,
            routeWhileDragging: false,
            show: true, // Hiển thị bảng hướng dẫn chi tiết
          }).addTo(mapInstance.current!);
        };

        if (walkBtn) walkBtn.onclick = () => drawRoute("foot");
        if (driveBtn) driveBtn.onclick = () => drawRoute("car");
      });
    });
  }, [items, userPos]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%", // Đảm bảo thẻ cha chứa nó có height cụ thể (ví dụ: 600px)
          borderRadius: "16px",
          zIndex: 1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />
      {/* CSS Overlay để bản đồ không bị lỗi font */}
      <style>{`
        .leaflet-container { font-family: inherit !important; }
        .leaflet-routing-container { 
          background: rgba(255, 255, 255, 0.9); 
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default MapContainerBase;
