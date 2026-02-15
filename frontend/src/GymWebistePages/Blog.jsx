import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/blog/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("GET BLOGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <Header />

      <h1 className="text-center text-[30px] mt-6">Blog</h1>

      <div className="p-[30px] flex flex-wrap gap-[40px] justify-center">
        {loading ? (
          <p className="text-gray-600">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-600">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => navigate(`/blog/${blog._id}`)}
              className="
                cursor-pointer
                w-full md:w-[25%]
                h-[420px]
                bg-gray-100
                rounded-xl
                p-4
                hover:shadow-lg
                transition
                flex flex-col
              "
            >
              {/* IMAGE */}
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-[180px] w-full object-cover rounded-xl"
                />
              )}

              {/* TITLE */}
              <h2 className="mt-3 text-[18px] font-semibold">
                {blog.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-700 mt-2  line-clamp-3">
                {blog.description}
              </p>

              {/* AUTHOR + DATE (ALWAYS BOTTOM) */}
              <p className="text-sm text-gray-500 mt-auto">
                By {blog.author} ·{" "}
                {new Date(blog.date).toDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default Blog;
