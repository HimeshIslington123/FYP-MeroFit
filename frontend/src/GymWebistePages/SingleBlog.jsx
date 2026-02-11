import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/blog/blog/${id}`
      );
      setBlog(res.data);
    } catch (err) {
      console.error("GET SINGLE BLOG ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found</p>;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-xl mb-6"
          />
        )}

        <h1 className="text-3xl font-bold">{blog.title}</h1>

        <p className="text-gray-500 mt-2">
          By {blog.author} ·{" "}
          {new Date(blog.date).toDateString()}
        </p>

        <p className="mt-6 text-gray-800 text-justify leading-7 whitespace-pre-line">
          {blog.description}
        </p>
      </div>

      <Footer />
    </>
  );
};

export default SingleBlog;
