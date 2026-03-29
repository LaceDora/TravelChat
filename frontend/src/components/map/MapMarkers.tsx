import { useEffect } from "react";
import L from "leaflet";

interface MapItem {
  id: number;
  title: string;
  type: string;
  lat: number;
  lng: number;
}

interface Props {
  map: L.Map | null;
  items: MapItem[];
}

const MapMarkers = ({ map, items }: Props) => {
  useEffect(() => {
    if (!map || items.length === 0) return;

    const markers: L.Marker[] = [];

    items.forEach((item) => {
      if (!item.lat || !item.lng) return;

      const iconColor =
        item.type === "hotel"
          ? "blue"
          : item.type === "restaurant"
            ? "green"
            : "red";

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background:${iconColor};
          width:16px;
          height:16px;
          border-radius:50%;
          border:2px solid white;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([item.lat, item.lng], { icon })
        .bindPopup(
          `
          <strong>${item.title}</strong><br/>
          <a href="/${item.type}/${item.id}" style="color:#2563eb">
            Xem chi tiết
          </a>
        `,
        )
        .addTo(map);

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, items]);

  return null;
};

export default MapMarkers;
