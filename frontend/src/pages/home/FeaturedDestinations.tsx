import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Giả định bạn dùng react-router-dom
import { ArrowRight } from "lucide-react"; // Giả định bạn dùng lucide-react cho icon

interface Location {
  id: number;
  name: string;
  image_url: string;
  country_name: string;
  tours_count?: number; // Thêm trường này nếu API có trả về số lượng tour
}

export default function FeaturedDestinations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleCount = 4;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, []);

  useEffect(() => {
    if (locations.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % locations.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [locations, isPaused]);

  const display = [];
  if (locations.length > 0) {
    for (let i = 0; i < visibleCount; i++) {
      display.push(locations[(index + i) % locations.length]);
    }
  }

  return (
    <section className="mb-24 px-4 md:px-0 overflow-hidden">
      {/* Header Phần Tiêu Đề */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Điểm đến được yêu thích
          </h2>
          <p className="text-slate-500 font-medium">
            Khám phá những vùng đất hứa hẹn mang lại trải nghiệm tuyệt vời nhất.
          </p>
        </div>
        <Link
          to="/locations"
          className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
        >
          Xem tất cả <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Danh sách Slider với Style Mới */}
      <div
        className="flex gap-6 transition-all duration-500 ease-in-out"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {display.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            to={`/locations/${item.id}`}
            className="group relative block rounded-[2rem] overflow-hidden bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 aspect-[4/5] flex-shrink-0 w-[calc(25%-1.15rem)]"
          >
            {/* Ảnh Nền */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={item.image_url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                alt={item.name}
              />
            </div>

            {/* Lớp phủ Gradient để chữ nổi bật */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Nội dung đè lên ảnh */}
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-cyan-400 font-bold mb-1 text-sm tracking-wider uppercase">
                {item.country_name || "Destination"}
              </p>
              <h3 className="font-extrabold text-white text-2xl mb-2">
                {item.name}
              </h3>

              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Nút xem tất cả cho Mobile */}
      <div className="mt-8 text-center md:hidden">
        <Link
          to="/locations"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold"
        >
          Xem tất cả <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
