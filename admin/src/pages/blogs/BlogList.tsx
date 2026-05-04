import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogService, { Blog } from "../../services/BlogService";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // States cho Tìm kiếm và Phân trang
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng bài viết trên mỗi trang

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const data = await BlogService.getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa bài viết này?")) return;
    try {
      await BlogService.deleteBlog(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  // 1. Xử lý lọc dữ liệu theo tìm kiếm
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  // 2. Xử lý phân trang
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Bài viết
            </h1>
            <p className="text-xs text-gray-400">
              {filteredBlogs.length} bài viết
            </p>
          </div>
        </div>
        <Link
          to="/admin/blogs/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm no-underline"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Tìm tiêu đề bài viết..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
          }}
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                <th className="px-5 py-3.5 text-left">ID</th>
                <th className="px-5 py-3.5 text-left">Hình ảnh</th>
                <th className="px-5 py-3.5 text-left">Tiêu đề</th>
                <th className="px-5 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-left">Ngày tạo</th>
                <th className="px-5 py-3.5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-500">{blog.id}</td>
                  <td className="px-5 py-4">
                    {blog.cover_url ? (
                      <img
                        src={blog.cover_url}
                        alt={blog.title}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs text-center px-1">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-72">
                      <div
                        className="text-sm font-semibold text-gray-800 truncate"
                        title={blog.title}
                      >
                        {blog.title}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-tighter">
                        Bài viết Blog
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {blog.is_published ? (
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-emerald-100 text-emerald-600">
                        Công khai
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-gray-100 text-gray-500">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1.5">
                      <Link
                        to={`/admin/blogs/edit/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => blog.id && handleDelete(blog.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBlogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy bài viết nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (GIỐNG MẪU NHÀ HÀNG) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-gray-50">
            <div className="text-xs text-gray-500">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredBlogs.length)} trong tổng số{" "}
              {filteredBlogs.length}
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === 1
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === totalPages
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
