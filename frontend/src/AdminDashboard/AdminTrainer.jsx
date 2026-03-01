import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";
import { UserPlus, Users, Award, Image as ImageIcon, Mail, ShieldCheck, X, Plus } from "lucide-react";

const AdminTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // --- State to toggle form ---

  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    specialistTrainer: "gain muscles",
    certifications: "",
    bio: "",
    image: null,
  });

  const fetchTrainers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/trainers");
      setTrainers(res.data.trainers);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setTrainer((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in trainer) {
        if (trainer[key]) formData.append(key, trainer[key]);
      }
      const res = await axios.post(
        "http://localhost:4000/api/users/createtrainer",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(res.data.message);
      setTrainer({
        name: "", email: "", password: "", address: "",
        specialistTrainer: "gain muscles", certifications: "", bio: "", image: null,
      });
      setShowForm(false); 
      fetchTrainers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding trainer");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <Navbar />
      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        
    
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-slate-800 text-3xl ">Trainer Management</h2>
            <p className="text-slate-500 text-lg mt-2 font-medium">Add and oversee your team of experts.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* --- TOGGLE BUTTON --- */}
            <button 
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
                showForm 
                ? "bg-slate-800 text-white shadow-slate-200" 
                : "bg-[#2bb3a3] text-white shadow-[#2bb3a3]/20 hover:bg-[#229e8f]"
              }`}
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Close Form" : "Add New Trainer"}
            </button>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-2 bg-[#e8f7f6] rounded-xl">
                <Users className="text-[#2bb3a3]" size={24} />
              </div>
              <p className="text-xl font-bold text-slate-800">{trainers.length}</p>
            </div>
          </div>
        </div>

        {/* --- CONDITIONAL ADD TRAINER FORM --- */}
        {showForm && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-16 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-50 rounded-lg">
                <UserPlus className="text-[#e67e22]" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Register New Trainer</h3>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Full Name</label>
                <input type="text" name="name" value={trainer.name} onChange={handleChange} required placeholder="Full Name"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none transition-all font-semibold" />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Email Address</label>
                <input type="email" name="email" value={trainer.email} onChange={handleChange} required placeholder="trainer@fitness.com"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none transition-all font-semibold" />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Access Password</label>
                <input type="password" name="password" value={trainer.password} onChange={handleChange} required placeholder="••••••••"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none transition-all font-semibold" />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Specialization</label>
                <select name="specialistTrainer" value={trainer.specialistTrainer} onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-semibold text-slate-700">
                  <option value="weight loss">Weight Loss</option>
                  <option value="gain muscles">Gain Muscles</option>
                  <option value="stay fit">Stay Fit</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Certifications</label>
                <input type="text" name="certifications" value={trainer.certifications} onChange={handleChange} placeholder="e.g. NASM, ACE"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-semibold" />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Profile Photo</label>
                <div className="relative">
                  <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-full p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm">
                    <ImageIcon size={18} /> {trainer.image ? trainer.image.name : "Upload Image"}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase ml-1">Short Bio</label>
                <textarea name="bio" value={trainer.bio} onChange={handleChange} placeholder="Tell us about their experience..."
                  className="w-full p-4 h-32 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-semibold resize-none" />
              </div>

              <div className="flex gap-4 md:col-span-1">
                <button type="submit" className="flex-1 bg-[#2bb3a3] hover:bg-[#229e8f] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#2bb3a3]/20 transition-all active:scale-95">
                  Save Trainer
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-100 text-slate-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TRAINER LIST GRID --- */}
        <div className="flex items-center justify-between mb-8 ml-2">
            <h2 className="text-3xl font-bold text-slate-800">Active Roster</h2>
            {!showForm && <p className="text-slate-400 text-sm font-semibold">{trainers.length} Trainers found</p>}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#2bb3a3] font-bold">Refreshing list...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t) => (
              <div key={t.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
                <div className="relative h-56 rounded-[2rem] overflow-hidden mb-6">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><Users size={48} /></div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck size={14} className="text-[#2bb3a3]" />
                    <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Verified</span>
                  </div>
                </div>

                <div className="px-2">
                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-[#2bb3a3] transition-colors">{t.name}</h3>
                  <p className="text-[#2bb3a3] font-bold text-xs uppercase tracking-widest mt-1 mb-4">{t.specialistTrainer}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <Mail size={16} className="text-slate-300" /> {t.email}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <Award size={16} className="text-orange-400" /> {t.certifications || "General Cert"}
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mt-2">{t.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrainer;