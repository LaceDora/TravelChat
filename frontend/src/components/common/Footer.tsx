import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-bold text-white mb-4 block">
            Travel SE Asia
          </Link>
          <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
            Khám phá những vùng đất mới, trải nghiệm văn hóa đa dạng và tạo ra
            những kỷ niệm khó quên cùng chúng tôi tại Đông Nam Á.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Khám phá</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/tours" className="hover:text-cyan-400 transition">
                Tours nổi bật
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-cyan-400 transition">
                Khách sạn & Nhà hàng
              </Link>
            </li>
            <li>
              <Link to="/locations" className="hover:text-cyan-400 transition">
                Bản đồ du lịch
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h3>
          <ul className="space-y-3">
            <li>
              <Link to="#" className="hover:text-cyan-400 transition">
                Trung tâm trợ giúp
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-cyan-400 transition">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-cyan-400 transition">
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
        © 2026 Travel SE Asia. All rights reserved.
      </div>
    </footer>
  );
}
