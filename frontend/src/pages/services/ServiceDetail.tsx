import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getIconByType } from "../../components/map/mapIcons";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ServiceDetail() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (!id || !type) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/${type}s/${id}`);
        const data = await res.json();
        setService(data.data ?? data);

        let endpoint =
          type === "hotel"
            ? `http://127.0.0.1:8000/api/hotels/${id}/rooms`
            : `http://127.0.0.1:8000/api/restaurants/${id}/tables`;

        const res2 = await fetch(endpoint);
        const data2 = await res2.json();
        setItems(data2.data ?? data2);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  if (loading || !service)
    return <p className="text-center py-20">Đang tải...</p>;

  let amenities: string[] = [];
  let menu: any[] = [];
  try {
    amenities =
      typeof service.amenities === "string"
        ? JSON.parse(service.amenities)
        : service.amenities || [];
    menu =
      typeof service.menu === "string"
        ? JSON.parse(service.menu)
        : service.menu || [];
  } catch (e) {
    console.log("JSON lỗi");
  }

  const lat = Number(service.lat);
  const lng = Number(service.lng);
  const defaultIcon = getIconByType(type || "location");

  return (
    // 1. THÊM NỀN XANH NHẠT TOÀN TRANG
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-gray-700 font-medium shadow-sm transition-all"
        >
          ← Quay lại
        </button>

        {/* 2. GIỮ NGUYÊN FORM: ẢNH + MAP Ở TRÊN */}
        <div className="w-full rounded-[2rem] mb-8 overflow-hidden relative shadow-md border border-white">
          <img
            src={service.image_url || "https://via.placeholder.com/800x400"}
            alt={service.name}
            className="w-full object-cover"
            style={{ maxHeight: 450 }}
          />
          <div
            className="absolute bottom-4 right-4 w-64 h-40 z-10 border-4 border-white rounded-2xl shadow-xl overflow-hidden bg-white cursor-pointer"
            onClick={() => setShowMapModal(true)}
          >
            {lat && lng && !isNaN(lat) && !isNaN(lng) ? (
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
                dragging={false}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={defaultIcon}>
                  <Popup>{service.name}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Không có vị trí
              </div>
            )}
          </div>
        </div>

        {/* 3. PHẦN NỘI DUNG BỌC TRONG CARD TRẮNG CHO NỔI TRÊN NỀN XANH */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
              {service.name}
            </h1>
            {service.address && (
              <p className="text-slate-500 font-medium">{service.address}</p>
            )}
            {service.rating && (
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                  {service.rating}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  Đánh giá dịch vụ
                </span>
              </div>
            )}
          </div>

          {/* GIÁ: CHỈNH THEO MẪU ẢNH (Bỏ icon túi tiền) */}
          <div className="mb-10 pb-8 border-b border-slate-100">
            {service.is_promotion && service.discount_percent > 0 ? (
              <div className="space-y-1">
                <p className="text-slate-400 line-through text-lg font-medium">
                  {type === "hotel"
                    ? `${Number(service.price_per_night).toLocaleString()} VND`
                    : `${Number(service.min_price).toLocaleString()} - ${Number(service.max_price).toLocaleString()} VND`}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-black text-red-500">
                    {type === "hotel"
                      ? `${(Number(service.price_per_night) * (1 - service.discount_percent / 100)).toLocaleString()} VND`
                      : `${(Number(service.min_price) * (1 - service.discount_percent / 100)).toLocaleString()} - ${(Number(service.max_price) * (1 - service.discount_percent / 100)).toLocaleString()} VND`}
                  </p>
                  <span className="bg-red-100 text-red-500 px-2 py-1 rounded-lg text-xs font-bold">
                    -{service.discount_percent}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-3xl font-black text-red-500">
                {type === "hotel"
                  ? `${Number(service.price_per_night).toLocaleString()} VND / đêm`
                  : `${Number(service.min_price).toLocaleString()} - ${Number(service.max_price).toLocaleString()} VND`}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">
              {type === "hotel" ? "Mô tả khách sạn" : "Giới thiệu nhà hàng"}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {service.description || "Chưa có mô tả"}
            </p>
          </div>

          {/* AMENITIES */}
          {amenities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                Tiện nghi
              </h2>
              <div className="flex flex-wrap gap-3">
                {amenities.map((a, i) => (
                  <span
                    key={i}
                    className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-700 font-medium shadow-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MENU */}
          {type === "restaurant" && menu.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                Thực đơn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((m, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center"
                  >
                    <span className="font-bold text-slate-700">{m.name}</span>
                    <span className="font-black text-red-500">
                      {Number(m.price).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROOMS / TABLES */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-slate-900 border-l-4 border-blue-600 pl-4">
              {type === "hotel" ? "Danh sách phòng" : "Danh sách bàn"}
            </h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 font-medium">
                      Sức chứa: {item.capacity} người | Còn lại: {item.quantity}
                    </p>
                    {type === "hotel" && item.bed_type && (
                      <p className="text-slate-500 italic">
                        Giường: {item.bed_type} - {item.area}m²
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-2xl font-black text-slate-900 mb-3">
                      {Number(
                        type === "hotel" ? item.price_per_night : item.price,
                      ).toLocaleString()}
                      đ
                    </p>
                    <Link
                      to={`/services/${type}/${id}/book?item_id=${item.id}`}
                      className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                      {type === "hotel" ? "Đặt phòng" : "Đặt bàn"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Map (Giữ nguyên) */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl h-[70vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 z-[60] bg-slate-900 text-white px-4 py-2 rounded-xl font-bold"
              onClick={() => setShowMapModal(false)}
            >
              Đóng
            </button>
            <MapContainer
              center={[lat, lng]}
              zoom={16}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={defaultIcon}>
                <Popup>{service.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
