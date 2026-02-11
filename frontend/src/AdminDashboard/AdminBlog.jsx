import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";
import { Pencil, Trash2, Plus } from "lucide-react";

const AdminBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // ⭐ UI CONTROL

  // ---------------- INPUT HANDLERS ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (image) data.append("image", image);

      if (editingId) {
        await axios.put(
          `http://localhost:4000/api/blog/blog/${editingId}`,
          data
        );
        alert("Blog updated");
      } else {
        await axios.post("http://localhost:4000/api/blog/blog", data);
        alert("Blog published");
      }

      resetForm();
      fetchBlogs();
      setShowForm(false); // 👈 CLOSE FORM
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET ----------------
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      date: "",
      description: "",
    });
    setImage(null);
    setEditingId(null);
  };

  // ---------------- FETCH BLOGS ----------------
  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const res = await axios.get("http://localhost:4000/api/blog/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ---------------- EDIT ----------------
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      author: blog.author,
      date: blog.date?.split("T")[0],
      description: blog.description,
    });
    setImage(null);
    setShowForm(true); // 👈 OPEN FORM
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    await axios.delete(`http://localhost:4000/api/blog/blog/${id}`);
    fetchBlogs();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Management</h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
            >
              <Plus size={18} /> Add New Blog
            </button>
          )}
        </div>

        {/* ---------------- FORM ---------------- */}
        {showForm && (
          <div className="bg-white p-6 rounded shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Blog" : "Add Blog"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <textarea
                name="description"
                rows="5"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input type="file" accept="image/*" onChange={handleImageChange} />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- BLOG LIST ---------------- */}
        {!showForm && (
          <div className="space-y-5">
            {blogsLoading ? (
              <p>Loading blogs...</p>
            ) : (
              blogs.map((b) => (
                <div
                  key={b._id}
                  className="bg-white p-4 rounded shadow flex gap-4"
                >
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-40 h-28 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-gray-500">
                      {b.author} ·{" "}
                      {new Date(b.date).toLocaleDateString()}
                    </p>
                    <p className="mt-2 line-clamp-2 text-gray-700">
                      {b.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Pencil
                      className="cursor-pointer text-blue-600"
                      onClick={() => handleEdit(b)}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(b._id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
