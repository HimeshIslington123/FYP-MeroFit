import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TrainerNavbar from "./Trainernavbar";
import { 
  User, 
  Scale, 
  Ruler, 
  Target, 
  Zap, 
  Dumbbell, 
  Calendar, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrainerUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/users/user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-screen text-[#2bb3a3] font-bold">
      Loading Profile...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <TrainerNavbar />

      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#2bb3a3] font-bold transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back 
        </button>

        {/* --- PROFILE HEADER --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem]  flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              
                <User size={50} className="" />
  
            </div>
            
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl ">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="bg-[#e8f7f6] text-[#2bb3a3] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {user.goal || "General Fitness"}
              </span>
              <span className="bg-slate-100  px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                Age: {user.age}
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/trainerchat/${user._id}`)}
            className="bg-[#2bb3a3] hover:bg-[#229e8f] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#2bb3a3]/20 transition-all active:scale-95"
          >
            Send Message
          </button>
        </div>

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Physical Vitals */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 lg:col-span-2">
            <h3 className="text-xl  mb-8 flex items-center gap-3">
             Physical Vitals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Weight</p>
                <p className="text-3xl ">{user.weight}<span className="text-sm ml-1 text-slate-400">kg</span></p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Height</p>
                <p className="text-3xl ">{user.height}<span className="text-sm ml-1 text-slate-400">cm</span></p>
              </div>
              <div className="bg-[#fff7ed] p-6 rounded-3xl border border-orange-100">
                <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Target Weight</p>
                <p className="text-3xl  text-orange-600">{user.targetWeight}<span className="text-sm ml-1 text-orange-400">kg</span></p>
              </div>
            </div>
          </div>

          {/* Fitness Level */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h3 className="text-xl mb-8 flex items-center gap-3">
              <Zap className="text-[#2bb3a3]" size={24} /> Training Status
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-sm">Fitness Level</span>
                <span className="bg-[#e8f7f6] text-[#2bb3a3] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight">
                  {user.fitnesslevel || "Beginner"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-sm">Activity</span>
                <span className="text-slate-800  text-sm">{user.activityLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-sm">Frequency</span>
                <span className="text-slate-800 text-sm">{user.frequency}</span>
              </div>
            </div>
          </div>

        
 

        </div>
      </div>
    </div>
  );
};

export default TrainerUserDetail;