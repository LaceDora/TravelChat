import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  content: string;
  cover_url?: string;
  created_at: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/blogs/${id}`)
      .then((res) => res.json())
      .then((res) => {
        // 👉 hỗ trợ cả 2 kiểu: trả thẳng object hoặc { data: object }
        const blogData = res.data ?? res;
        setBlog(blogData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Đang tải blog...</div>;
  }

  if (!blog) {
    return <div className="text-center py-10">Không tìm thấy blog</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Quay lại
      </button>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <p className="text-gray-500 text-sm mb-6">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>

      {blog.cover_url && (
        <img
          src={blog.cover_url}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl mb-8"
        />
      )}

      {/* 🔥 QUAN TRỌNG: render HTML content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
