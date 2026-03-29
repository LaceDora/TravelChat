const API_URL = "http://127.0.0.1:8000/api/admin/blogs";

export interface Blog {
  id?: number;
  title: string;
  content: string;
  cover_url?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

class BlogService {
  // Get all blogs
  async getBlogs(): Promise<Blog[]> {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    return await res.json();
  }

  // Get single blog
  async getBlog(id: number): Promise<Blog> {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }

    return await res.json();
  }

  // Create blog
  async createBlog(blog: Blog): Promise<Blog> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blog),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Create blog error:", errorText);
      throw new Error("Failed to create blog");
    }

    return await res.json();
  }

  // Update blog
  async updateBlog(id: number, blog: Blog): Promise<Blog> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blog),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update blog error:", errorText);
      throw new Error("Failed to update blog");
    }

    return await res.json();
  }

  // Delete blog
  async deleteBlog(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete blog error:", errorText);
      throw new Error("Failed to delete blog");
    }
  }
}

export default new BlogService();
