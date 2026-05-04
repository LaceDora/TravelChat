import { User, Mail, Phone, MapPin, Calendar, Lock } from "lucide-react";

interface Props {
  label: string;
  value?: string;
  edit?: boolean;
  type?: string;
  onChange?: (v: string) => void;
}

export default function ProfileField({
  label,
  value,
  edit = false,
  type = "text",
  onChange,
}: Props) {
  // Hàm tự động chọn icon dựa trên nhãn
  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("tên")) return <User size={18} />;
    if (l.includes("email")) return <Mail size={18} />;
    if (l.includes("số") || l.includes("phone")) return <Phone size={18} />;
    if (l.includes("địa chỉ")) return <MapPin size={18} />;
    if (l.includes("ngày sinh")) return <Calendar size={18} />;
    if (l.includes("mật khẩu")) return <Lock size={18} />;
    return <User size={18} />;
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wider">
        {label}
      </label>

      <div className="relative group">
        {/* Icon nằm bên trái */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {getIcon(label)}
        </div>

        {edit ? (
          <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="
              w-full h-12 pl-12 pr-4 rounded-2xl
              border border-slate-200 bg-white
              text-slate-900 font-medium
              focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500
              transition-all duration-200
            "
            placeholder={`Nhập ${label.toLowerCase()}...`}
          />
        ) : (
          <div
            className="
              w-full h-12 pl-12 pr-4 flex items-center
              rounded-2xl border border-slate-100
              bg-slate-50 text-slate-700 font-semibold
              shadow-sm shadow-slate-100/50
            "
          >
            {value || (
              <span className="text-slate-300 font-normal">Chưa cập nhật</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
