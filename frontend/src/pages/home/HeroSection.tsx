import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (date) params.append("date", date);
    if (guests) params.append("guests", guests);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative rounded-[2.5rem] overflow-hidden mb-24 shadow-2xl">
      <img
        src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop"
        className="w-full h-[600px] object-cover"
        alt="Hero"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20">
        <div className="max-w-3xl text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-6">
            ✨ Trải nghiệm Đông Nam Á
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Khám phá vẻ đẹp <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Châu Á đích thực
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 leading-relaxed text-slate-200 font-medium max-w-2xl">
            Tận hưởng những chuyến đi đáng nhớ với hàng ngàn điểm đến hấp dẫn.
            Đặt tour dễ dàng, giá cả minh bạch, hỗ trợ tận tâm.
          </p>

          <Link
            to="/tours"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1"
          >
            Bắt đầu khám phá
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Search Bar Floating */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 text-white rounded-full hidden md:flex items-center gap-2 shadow-2xl">
        <div className="flex-1 flex items-center gap-3 px-6 border-r border-white/20">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-300 font-medium">Địa điểm</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Bạn muốn đi đâu?"
              className="bg-transparent border-none p-0 text-sm font-semibold placeholder:text-white/70 focus:ring-0 outline-none w-full text-white"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 px-6 border-r border-white/20">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-300 font-medium">
              Khởi hành
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Thêm ngày"
              className="bg-transparent border-none p-0 text-sm font-semibold placeholder:text-white/70 focus:ring-0 outline-none w-full text-white [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 px-6">
          <Users className="w-5 h-5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-300 font-medium">
              Hành khách
            </span>
            <input
              type="text"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="1 khách, 1 phòng"
              className="bg-transparent border-none p-0 text-sm font-semibold placeholder:text-white/70 focus:ring-0 outline-none w-full text-white"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-full transition-colors flex-shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
