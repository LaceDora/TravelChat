import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogService from "../../services/BlogService";
import { Save, X, FileEdit, ImageIcon } from "lucide-react";

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    cover_url: "",
    is_published: true,
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  async function fetchBlog() {
    try {
      const data = await BlogService.getBlog(Number(id));

      setFormData({
        title: data.title || "",
        content: data.content || "",
        cover_url: data.cover_url || "",
        is_published: data.is_published ?? true,
      });
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      alert("Không thể tải dữ liệu bài viết.");
    } finally {
      setLoading(false);
    }
  }

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
    if (!id) return;

    setSaving(true);

    try {
      await BlogService.updateBlog(Number(id), formData);
      alert("Cập nhật bài viết thành công!");
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Lỗi cập nhật bài viết:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải dữ liệu bài viết...
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
          <FileEdit size={22} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
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
            Công khai bài viết này
          </label>
        </div>

        {/* Các nút điều hướng */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:bg-emerald-300"
          >
            <Save size={18} />
            {saving ? "Đang lưu..." : "Cập nhật bài viết"}
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
