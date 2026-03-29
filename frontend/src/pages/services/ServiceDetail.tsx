import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getIconByType } from "../../components/map/mapIcons";
// ICON cho marker: chuyển vào trong render để lấy đúng type
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

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
        // 👉 Lấy detail
        const res = await fetch(`http://127.0.0.1:8000/api/${type}s/${id}`);
        const data = await res.json();
        const serviceData = data.data ?? data;

        setService(serviceData);

        // 👉 Lấy rooms / tables
        let endpoint = "";
        if (type === "hotel") {
          endpoint = `http://127.0.0.1:8000/api/hotels/${id}/rooms`;
        } else if (type === "restaurant") {
          endpoint = `http://127.0.0.1:8000/api/restaurants/${id}/tables`;
        }

        if (endpoint) {
          const res2 = await fetch(endpoint);
          const data2 = await res2.json();
          setItems(data2.data ?? data2);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  if (loading || !service) {
    return <p className="text-center py-20">Đang tải...</p>;
  }

  // 👉 Parse JSON an toàn
  let amenities: string[] = [];
  let menu: any[] = [];

  try {
    if (service.amenities) {
      amenities =
        typeof service.amenities === "string"
          ? JSON.parse(service.amenities)
          : service.amenities;
    }

    if (service.menu) {
      menu =
        typeof service.menu === "string"
          ? JSON.parse(service.menu)
          : service.menu;
    }
  } catch (e) {
    console.log("JSON lỗi");
  }

  // Lấy lat/lng nếu có
  const lat = Number(service.lat);
  const lng = Number(service.lng);

  const defaultIcon = getIconByType(type || "location");

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium"
      >
        ← Quay lại
      </button>
      {/* 🔥 IMAGE + MAP */}
      <div className="w-full rounded-2xl mb-6 overflow-hidden relative">
        <img
          src={service.image_url || "https://via.placeholder.com/800x400"}
          alt={service.name}
          className="w-full"
          loading="eager"
          style={{
            width: "100%",
            maxHeight: 420,
            height: "auto",
            objectFit: "cover",
            imageRendering: "crisp-edges",
            background: "#f3f3f3",
          }}
        />
        {/* MAP luôn hiển thị khung */}
        <div
          className="absolute bottom-4 right-4 w-64 h-40 z-10 border-2 border-white rounded-xl shadow-lg overflow-hidden bg-white cursor-pointer"
          onClick={() => setShowMapModal(true)}
          title="Xem bản đồ lớn"
        >
          {lat && lng && !isNaN(lat) && !isNaN(lng) ? (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
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
              Không có vị trí bản đồ
            </div>
          )}
        </div>

        {/* Modal bản đồ lớn */}
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[70vh] flex flex-col">
              <button
                className="absolute top-2 right-2 z-10 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-900"
                onClick={() => setShowMapModal(false)}
                aria-label="Đóng bản đồ lớn"
              >
                Đóng
              </button>
              {lat && lng && !isNaN(lat) && !isNaN(lng) ? (
                <MapContainer
                  center={[lat, lng]}
                  zoom={16}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "1rem",
                  }}
                  dragging={true}
                  scrollWheelZoom={true}
                  doubleClickZoom={true}
                  zoomControl={true}
                  attributionControl={true}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[lat, lng]} icon={defaultIcon}>
                    <Popup>{service.name}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                  Không có vị trí bản đồ
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🔥 HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{service.name}</h1>

        {service.address && <p className="text-gray-500">{service.address}</p>}

        {service.rating && (
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded">
              {service.rating}
            </span>
            <span className="text-sm text-gray-500">Đánh giá</span>
          </div>
        )}
      </div>

      {/* 🔥 PRICE + GIẢM GIÁ */}
      <div className="mb-8">
        {type === "hotel" && service.price_per_night && (
          <div>
            {service.is_promotion && service.discount_percent > 0 ? (
              <>
                <p className="text-xl font-bold text-gray-400 line-through">
                  {Number(service.price_per_night).toLocaleString()} VND
                  <span className="text-sm text-gray-400"> / đêm</span>
                </p>
                <p className="text-2xl font-bold text-red-500">
                  {(
                    Number(service.price_per_night) *
                    (1 - service.discount_percent / 100)
                  ).toLocaleString()}{" "}
                  VND
                  <span className="text-sm text-gray-500"> / đêm</span>
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    -{service.discount_percent}%
                  </span>
                </p>
                {service.promotion_end && (
                  <p className="text-xs text-gray-500 mt-1">
                    Khuyến mãi đến:{" "}
                    {new Date(service.promotion_end).toLocaleString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold text-red-500">
                {Number(service.price_per_night).toLocaleString()} VND
                <span className="text-sm text-gray-500"> / đêm</span>
              </p>
            )}
          </div>
        )}

        {type === "restaurant" && (
          <div>
            {service.is_promotion && service.discount_percent > 0 ? (
              <>
                <p className="text-xl font-bold text-gray-400 line-through">
                  {Number(service.min_price || 0).toLocaleString()} -{" "}
                  {Number(service.max_price || 0).toLocaleString()} VND
                </p>
                <p className="text-2xl font-bold text-red-500">
                  {(
                    Number(service.min_price || 0) *
                    (1 - service.discount_percent / 100)
                  ).toLocaleString()}{" "}
                  -{" "}
                  {(
                    Number(service.max_price || 0) *
                    (1 - service.discount_percent / 100)
                  ).toLocaleString()}{" "}
                  VND
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    -{service.discount_percent}%
                  </span>
                </p>
                {service.promotion_end && (
                  <p className="text-xs text-gray-500 mt-1">
                    Khuyến mãi đến:{" "}
                    {new Date(service.promotion_end).toLocaleString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold text-red-500">
                {Number(service.min_price || 0).toLocaleString()} -{" "}
                {Number(service.max_price || 0).toLocaleString()} VND
              </p>
            )}
          </div>
        )}
      </div>

      {/* 🔥 DESCRIPTION */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">
          {type === "hotel" ? "Mô tả khách sạn" : "Giới thiệu nhà hàng"}
        </h2>
        <p className="text-gray-700">
          {service.description || "Chưa có mô tả"}
        </p>
      </div>

      {/* 🔥 AMENITIES */}
      {amenities.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Tiện nghi</h2>
          <div className="flex flex-wrap gap-3">
            {amenities.map((a, i) => (
              <span
                key={i}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 MENU (restaurant only) */}
      {type === "restaurant" && menu.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Thực đơn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((m, i) => (
              <div
                key={i}
                className="border p-4 rounded-xl flex justify-between"
              >
                <span>{m.name}</span>
                <span className="font-semibold">
                  {Number(m.price).toLocaleString()} VND
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 ROOMS / TABLES */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {type === "hotel" ? "Danh sách phòng" : "Danh sách bàn"}
        </h2>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6"
            >
              {/* LEFT */}
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <p className="text-gray-600">Sức chứa: {item.capacity} người</p>

                <p className="text-gray-600">
                  Còn lại: {item.quantity} {type === "hotel" ? "phòng" : "bàn"}
                </p>

                {/* hotel extra */}
                {type === "hotel" && item.bed_type && (
                  <p className="text-gray-600">Giường: {item.bed_type}</p>
                )}

                {type === "hotel" && item.area && (
                  <p className="text-gray-600">Diện tích: {item.area} m²</p>
                )}
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-2xl font-bold mb-3">
                  {Number(
                    type === "hotel" ? item.price_per_night : item.price,
                  ).toLocaleString()}{" "}
                  VND
                </p>

                <Link
                  to={`/services/${type}/${id}/book?item_id=${item.id}`}
                  className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
                >
                  {type === "hotel" ? "Đặt phòng" : "Đặt bàn"}
                </Link>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-gray-500">
              {type === "hotel"
                ? "Khách sạn hiện chưa có phòng."
                : "Nhà hàng hiện chưa có bàn."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
