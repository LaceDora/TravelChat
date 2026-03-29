import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../service/api";

interface Blog {
  id: number;
  title: string;
  cover_url?: string;
  created_at: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    apiGet<any>("/blogs").then((res) => {
      setBlogs(res.data ?? res);
    });
  }, []);

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog</h2>
        <span className="text-blue-600 text-sm cursor-pointer">See all</span>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <Link to={`/blogs/${blog.id}`} key={blog.id} className="block">
            <div className="flex gap-4 bg-white rounded-xl p-4 shadow hover:shadow-md transition">
              <img
                src={blog.cover_url || "/no-image.jpg"}
                className="w-28 h-20 object-cover rounded-lg"
                alt={blog.title}
              />

              <div>
                <h3 className="font-semibold line-clamp-2">{blog.title}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
