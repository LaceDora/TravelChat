import { useEffect, useState } from "react";

interface Location {
  id: number;
  name: string;
  image_url: string;
  country_name: string;
}

export default function FeaturedDestinations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleCount = 4; // Số lượng ảnh hiển thị cùng lúc

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, []);

  // Tự động chạy slider
  useEffect(() => {
    if (locations.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % locations.length);
    }, 3000); // 3 giây chuyển 1 lần

    return () => clearInterval(timer);
  }, [locations, isPaused]);

  // Xử lý logic hiển thị xoay vòng (carousel)
  const display = [];
  if (locations.length > 0) {
    for (let i = 0; i < visibleCount; i++) {
      display.push(locations[(index + i) % locations.length]);
    }
  }

  return (
    <section className="mb-20 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Địa điểm nổi bật</h2>
      <div
        className="flex gap-6 transition-all duration-500"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {display.map((item, idx) => (
          <a
            key={`${item.id}-${idx}`} // Dùng cả idx để tránh trùng key khi xoay vòng
            href={`/locations/${item.id}`}
            className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition flex-shrink-0 w-[calc(25%-1.25rem)]"
          >
            <img
              src={item.image_url}
              className="w-full h-48 object-cover"
              alt={item.name}
            />
            <div className="p-4">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.country_name || ""}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
