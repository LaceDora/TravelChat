import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogService from "../../services/BlogService";
import { Save, X, Image as ImageIcon, FileText } from "lucide-react";

export default function BlogCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    cover_url: "",
    is_published: true,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await BlogService.createBlog(formData);
      alert("Đã thêm bài viết mới thành công!");
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      alert("Tạo bài viết thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <FileText size={22} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Thêm bài viết mới</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        {/* Tiêu đề */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Tiêu đề bài viết
          </label>
          <input
            type="text"
            name="title"
            placeholder="Nhập tiêu đề hấp dẫn..."
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* URL Ảnh bìa */}
        <div>
          <label className="flex items-center gap-2 mb-1.5 text-sm font-semibold text-gray-700 w-full">
            <ImageIcon size={16} /> URL Ảnh bìa
          </label>
          <input
            type="text"
            name="cover_url"
            placeholder="https://example.com/image.jpg"
            value={formData.cover_url}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Nội dung */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Nội dung bài viết
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Viết nội dung bài viết tại đây..."
            required
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Trạng thái xuất bản */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="is_published"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Công khai bài viết này (Người dùng có thể xem ngay)
          </label>
        </div>

        {/* Các nút điều hướng */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:bg-blue-300"
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Lưu bài viết"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
