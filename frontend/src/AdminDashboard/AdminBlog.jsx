import React, { useState } from "react";
import Navbar from "../AdminDashboardComponent/Navbar";

const AdminBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("date", formData.date);
    data.append("description", formData.description);
    data.append("image", image);

    console.log("Submitted Blog:", formData, image);
    // axios.post("/api/blog", data)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="  bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-6">Add Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Blog title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Author */}
          <input
            type="text"
            name="author"
            placeholder="Written by"
            value={formData.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Blog description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBlog;
