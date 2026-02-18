import React, { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [showMine, setShowMine] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // NEW STATE

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/api/post");
    setPosts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !file) return alert("Add something!");

    const fd = new FormData();
    fd.append("caption", caption);
    if (file) fd.append("image", file);

    await axios.post("http://localhost:4000/api/post/create", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCaption("");
    setFile(null);
    setShowForm(false); // CLOSE FORM AFTER POST
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const displayPosts = showMine
    ? posts.filter((p) => p.user._id === loggedInUserId)
    : posts;

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", fontFamily: "Arial" }}>
      
      {/* ADD POST BUTTON */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#1877f2",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: 8,
            marginBottom: 15,
            width: "100%",
          }}
        >
          + Add Post
        </button>
      )}

      {/* CREATE FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: 15,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
            marginBottom: 20,
          }}
        >
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />

          <input
            type="file"
            style={{ marginTop: 10 }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              type="submit"
              style={{
                background: "#1877f2",
                color: "#fff",
                padding: "8px 15px",
                border: "none",
                borderRadius: 8,
              }}
            >
              Post
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "#ccc",
                padding: "8px 15px",
                border: "none",
                borderRadius: 8,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* FILTER */}
      <div style={{ display: "flex", gap: 10, margin: "15px 0" }}>
        <button
          className="bg-amber-50 p-3 rounded-xl"
          onClick={() => setShowMine(false)}
        >
          All
        </button>
        <button
          className="bg-amber-50 p-3 rounded-xl"
          onClick={() => setShowMine(true)}
        >
          My Posts
        </button>
      </div>

      {/* FEED */}
      {displayPosts.map((post) => (
        <div
          key={post._id}
          style={{
            background: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <img
              src={post.user.image}
              alt=""
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <div>
              <strong>{post.user.name}</strong>
              <br />
              <small>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          </div>

          {post.image && (
            <img
              src={post.image}
              alt=""
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}

          <p style={{ marginTop: 10 }}>{post.caption}</p>

          {post.user._id === loggedInUserId && (
            <button
              onClick={() => handleDelete(post._id)}
              style={{ color: "red", border: "none", background: "none" }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Post;
