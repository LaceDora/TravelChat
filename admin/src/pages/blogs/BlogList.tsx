import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogService, { Blog } from "../../services/BlogService";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const data = await BlogService.getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Load blogs failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this blog?")) return;

    try {
      await BlogService.deleteBlog(id);

      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete blog failed");
    }
  }

  if (loading) return <p className="p-6">Loading blogs...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>

        <Link
          to="/admin/blogs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Blog
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Cover</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Created</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="text-center">
                <td className="p-2 border">{blog.id}</td>

                <td className="p-2 border text-left">{blog.title}</td>

                <td className="border p-2 text-center">
                  {blog.cover_url ? (
                    <img
                      src={blog.cover_url}
                      alt={blog.title}
                      style={{
                        width: "110px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        margin: "auto",
                      }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </td>

                <td className="p-2 border">
                  {blog.is_published ? (
                    <span className="text-green-600 font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">Hidden</span>
                  )}
                </td>

                <td className="p-2 border">
                  {blog.created_at
                    ? new Date(blog.created_at).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2 border space-x-2">
                  <Link
                    to={`/admin/blogs/edit/${blog.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => blog.id && handleDelete(blog.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {blogs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
