import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";

// icon leaflet (vite)
import { getIconByType } from "./mapIcons";

interface MapItem {
  id: number;
  title: string;
  type: string;
  lat: number;
  lng: number;
}

interface Props {
  items: MapItem[];
}

// Đã dùng getIconByType từ mapIcons

const MapMarkers = ({ items }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (items.length > 0) {
      const first = items[0];
      map.setView([first.lat, first.lng], 13);
    }
  }, [items, map]);

  return (
    <>
      {items.map((item) => {
        if (!item.lat || !item.lng) return null;

        return (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={getIconByType(item.type)}
          >
            <Popup>
              <strong>{item.title}</strong>
              <br />
              <a href={`/${item.type}/${item.id}`} style={{ color: "#2563eb" }}>
                Xem chi tiết
              </a>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapMarkers;
