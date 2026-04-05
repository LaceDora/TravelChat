import { Loader2 } from "lucide-react";

export default function Loader({
  text = "Đang tải dữ liệu...",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
      <span className="font-medium">{text}</span>
    </div>
  );
}
