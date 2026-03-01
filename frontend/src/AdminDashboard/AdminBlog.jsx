import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";
import { Pencil, Trash2, Plus, X, Calendar, User, FileText, Image as ImageIcon } from "lucide-react";

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
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const res = await axios.get("http://localhost:4000/api/blog/blogs");
      setBlogs(res.data);
    } catch (err) { console.error(err); } 
    finally { setBlogsLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      if (editingId) {
        await axios.put(`http://localhost:4000/api/blog/blog/${editingId}`, data);
      } else {
        await axios.post("http://localhost:4000/api/blog/blog", data);
      }
      resetForm();
      fetchBlogs();
      setShowForm(false);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: "", author: "", date: "", description: "" });
    setImage(null);
    setEditingId(null);
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      author: blog.author,
      date: blog.date?.split("T")[0],
      description: blog.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await axios.delete(`http://localhost:4000/api/blog/blog/${id}`);
    fetchBlogs();
  };

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <Navbar />

      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-slate-800 text-3xl ">Blog Center</h1>
            <p className="text-slate-500 text-lg mt-2 font-medium">Manage your community articles and fitness tips.</p>
          </div>

          <button
            onClick={() => { if(showForm) resetForm(); setShowForm(!showForm); }}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
              showForm ? "bg-slate-800 text-white" : "bg-[#2bb3a3] text-white shadow-[#2bb3a3]/20 hover:bg-[#229e8f]"
            }`}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? "Close Editor" : "Write New Post"}
          </button>
        </div>

        {/* --- FORM SECTION --- */}
        {showForm && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-50 rounded-lg">
                    <FileText className="text-[#e67e22]" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{editingId ? "Edit Post" : "New Post Details"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1 tracking-widest">Article Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter a catchy title..."
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none transition-all font-semibold text-lg" required />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1 tracking-widest">Author Name</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Admin or Coach Name"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none transition-all font-semibold" required />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1 tracking-widest">Publish Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none transition-all font-semibold" required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1 tracking-widest">Content</label>
                <textarea name="description" rows="6" value={formData.description} onChange={handleChange} placeholder="Write your fitness blog here..."
                  className="w-full p-5 rounded-[2rem] border border-gray-100 bg-gray-50 focus:bg-white outline-none transition-all font-medium resize-none" required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1 tracking-widest">Cover Image</label>
                <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-full p-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center gap-3 text-slate-400 font-bold">
                        <ImageIcon size={20} />
                        {image ? image.name : "Click to upload cover photo"}
                    </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-[#2bb3a3] hover:bg-[#229e8f] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#2bb3a3]/20 transition-all active:scale-95">
                  {loading ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
                </button>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="px-8 bg-gray-100 text-slate-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- BLOG LIST --- */}
        {!showForm && (
          <div className="grid grid-cols-1 gap-6">
            {blogsLoading ? (
              <div className="text-center py-20 text-[#2bb3a3] font-bold">Fetching articles...</div>
            ) : (
              blogs.map((b) => (
                <div key={b._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all group">
                  {b.image && (
                    <div className="w-full md:w-64 h-44 rounded-[2rem] overflow-hidden flex-shrink-0">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-center py-2">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="bg-[#e8f7f6] text-[#2bb3a3] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Article</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                            <Calendar size={14} />
                            {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-[#2bb3a3] transition-colors line-clamp-1">{b.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                        <User size={14} className="text-orange-400" />
                        <span className="font-semibold">{b.author}</span>
                    </div>

                    <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-medium">
                      {b.description}
                    </p>
                  </div>

                  <div className="flex md:flex-col justify-center gap-3">
                    <button onClick={() => handleEdit(b)} className="p-4 bg-[#e8f7f6] text-[#2bb3a3] rounded-2xl hover:bg-[#2bb3a3] hover:text-white transition-all">
                        <Pencil size={20} />
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="p-4 bg-orange-50 text-[#e67e22] rounded-2xl hover:bg-[#e67e22] hover:text-white transition-all">
                        <Trash2 size={20} />
                    </button>
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