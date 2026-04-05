import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../service/api";
import { ArrowRight, CalendarDays } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  cover_url: string;
  created_at: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Blog[]>("/blogs")
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : (data as any).data || [];
        // Shuffle arrayData
        const shuffled = arrayData.sort(() => Math.random() - 0.5);
        setBlogs(shuffled.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="mb-20 px-4 md:px-0">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Cẩm nang du lịch
        </h2>
        <Link
          to="/blogs"
          className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition"
        >
          Xem tất cả <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
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
        ))}
      </div>
    </section>
  );
}
