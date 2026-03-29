import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogService from "../../services/BlogService";

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
      console.error("Load blog failed:", error);
      alert("Failed to load blog");
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

      alert("Blog updated successfully!");

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Update blog failed:", error);
      alert("Failed to update blog");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading blog...</p>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

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

        {/* Cover URL */}
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
            disabled={saving}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            {saving ? "Updating..." : "Update Blog"}
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
