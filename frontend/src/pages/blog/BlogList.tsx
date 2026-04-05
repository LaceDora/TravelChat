import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "../../service/api";
import { CalendarDays } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  cover_url: string;
  created_at: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiGet<Blog[]>("/blogs")
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : (data as any).data || [];
        setBlogs(arrayData.sort(() => Math.random() - 0.5));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="text-center py-10">Đang tải blog...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Quay lại
      </button>
      <h1 className="text-3xl font-bold mb-8">Tất cả blog</h1>
      <div className="mb-8 flex justify-end">
        <input
          type="text"
          placeholder="Tìm kiếm blog theo tiêu đề..."
          className="border border-slate-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center text-slate-500">
            Không tìm thấy blog phù hợp.
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <Link
              to={`/blogs/${blog.id}`}
              key={blog.id}
              className="group flex flex-col bg-slate-50 rounded-3xl overflow-hidden hover:bg-slate-100 transition-colors duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.cover_url}
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  alt={blog.title}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(blog.created_at).toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
