import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogService from "../../services/BlogService";

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

      alert("Blog created successfully!");

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Create blog failed:", error);
      alert("Create blog failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block mb-1 font-medium">Cover Image URL</label>
          <input
            type="text"
            name="cover_url"
            value={formData.cover_url}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Publish */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
          />

          <label>Publish this blog</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
