import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Heart, Share2, Plus, Trash2 } from "lucide-react";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [showMine, setShowMine] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/post");
      setPosts(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !file) return alert("Add something!");
    const fd = new FormData();
    fd.append("caption", caption);
    if (file) fd.append("image", file);

    await axios.post("http://localhost:4000/api/post/create", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCaption(""); setFile(null); setShowForm(false);
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-[#2bb3a3]  text-2xl">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafb] py-5 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl ">Community</h1>
              <p className="text-lg text-[#2bb3a3] mt-2">Share your wins and inspire others</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#2bb3a3] hover:bg-[#24998b] text-white px-6 py-3 rounded-2xl  flex items-center gap-2 shadow-lg shadow-[#2bb3a3]/20 transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} /> New Post
            </button>
          </div>

          {/* Create Post Form (matches Add Food Entry style) */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#2bb3a3]/20 text-lg resize-none"
                rows={3}
              />
              <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2bb3a3]/10 file:text-[#2bb3a3] hover:file:bg-[#2bb3a3]/20"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-400 ">Cancel</button>
                  <button type="submit" className="bg-[#2bb3a3] text-white px-8 py-2 rounded-xl ">Post</button>
                </div>
              </div>
            </form>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-6 border-b mt-[10px] border-gray-200 pb-2">
            {['All', 'My Posts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setShowMine(tab === 'My Posts')}
                className={`pb-2 px-1 text-lg  transition-all ${
                  (tab === 'My Posts' ? showMine : !showMine)
                    ? "text-[#2bb3a3] border-b-4 border-[#2bb3a3]"
                    : "text-gray-400 border-b-4 border-transparent hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {displayPosts.map((post) => (
              <div key={post._id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#2bb3a3]/10 flex items-center justify-center text-[#2bb3a3] font-bold text-xl overflow-hidden border-2 border-white shadow-sm">
                      {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : post.user.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{post.user.name}</h4>
                      <p className="text-sm text-gray-400 font-medium">{new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  {post.user._id === loggedInUserId && (
                    <button onClick={() => handleDelete(post._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  {post.caption && <p className="text-slate-700 text-lg leading-relaxed mb-4">{post.caption}</p>}
                  {post.image && (
                    <img src={post.image} alt="" className="w-full rounded-[1.5rem] object-contain max-h-[450px] shadow-inner bg-gray-50" />
                  )}
                </div>

              
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar (Matches Sidebar from reference 2) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">🔥 Top Members This Week</h3>
            <div className="space-y-6">
              {['Sarah M.', 'James R.', 'Priya K.'].map((name, i) => (
                <div key={name} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? 'bg-teal-400' : i === 1 ? 'bg-orange-400' : 'bg-purple-400'}`}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-none">{name}</p>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{12 - i} Workouts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">📣 Active Challenges</h3>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-emerald-700 font-bold">30-Day Plank Challenge</p>
                <p className="text-emerald-600/60 text-sm font-bold">248 joined</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                <p className="text-cyan-700 font-bold">10K Steps Daily</p>
                <p className="text-cyan-600/60 text-sm font-bold">512 joined</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Post;