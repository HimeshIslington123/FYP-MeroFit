import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";
import { MessageSquare, Heart, Plus, Trash2, ShieldCheck, Globe, Users, AlertCircle, ImageIcon } from "lucide-react";

const AdminCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

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
    if (!caption && !file) return alert("Content required");
    const fd = new FormData();
    fd.append("caption", caption);
    if (file) fd.append("image", file);

    try {
      await axios.post("http://localhost:4000/api/post/create", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaption(""); setFile(null); setShowForm(false);
      fetchPosts();
    } catch (err) { alert("Failed to post"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Admin Action: Delete this post permanently?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) { alert("Delete failed"); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-[#2bb3a3] font-bold text-2xl">
  
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <Navbar />
      
      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        
        {/* --- ADMIN HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-slate-800 text-3xl ">Community Moderation</h2>
            <p className="text-slate-500 text-lg mt-2 font-medium">Manage user interactions and official announcements.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-[#e8f7f6] rounded-2xl">
                    <Globe className="text-[#2bb3a3]" size={28} />
                </div>
                <div>
                    <p className=" text-xs font-bold uppercase ">Total Posts</p>
                    <p className="text-2xl font-bold text-slate-800">{posts.length}</p>
                </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-slate-800 text-white px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Plus size={20} /> Official Post
            </button>
          </div>
        </div>

        {/* --- OFFICIAL POST FORM --- */}
        {showForm && (
          <div className="max-w-3xl mx-auto mb-16 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 mb-6">
              
                <h3 className="text-2xl font-bold text-slate-800">Create Official Announcement</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an announcement to the community..."
                className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-4 focus:ring-[#2bb3a3]/10 text-lg font-medium resize-none min-h-[150px]"
              />
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative group w-full md:w-auto">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-slate-500 font-bold text-sm flex items-center gap-2">
                    <ImageIcon size={18} /> {file ? file.name : "Attach Media"}
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-4 text-slate-400 font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#2bb3a3] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-[#2bb3a3]/20 hover:bg-[#229e8f]">Publish</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* --- MODERATION FEED --- */}
        <div className="max-w-4xl mx-auto space-y-8">
            

            {posts.map((post) => (
              <div key={post._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 group transition-all hover:shadow-xl relative overflow-hidden">
                
                {/* Admin Ribbon for official posts */}
                {post.user.role === 'admin' && (
                    <div className="absolute top-0 right-0 bg-[#2bb3a3] text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                        Official Announcement
                    </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-sm overflow-hidden">
                      {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : <Users className="m-auto mt-4 text-slate-300" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 text-xl">{post.user.name}</h4>

                      </div>
                      <p className="text-sm text-[#2bb3a3] font-bold mt-0.5">{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  
                  {/* DELETE POWER (Available for ALL posts for admin) */}
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="p-4 bg-orange-50 text-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white shadow-sm"
                    title="Moderator Action: Delete Post"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>

                <div className="mt-8 px-2">
                  {post.caption && <p className="text-slate-700 text-xl leading-relaxed mb-6 font-medium">{post.caption}</p>}
                  {post.image && (
                    <div className="rounded-[2rem] overflow-hidden border border-gray-50 bg-gray-50">
                        <img src={post.image} alt="" className="w-full object-contain max-h-[600px]" />
                    </div>
                  )}
                </div>

               
              </div>
            ))}

            {posts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No community activity yet</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


export default AdminCommunity;