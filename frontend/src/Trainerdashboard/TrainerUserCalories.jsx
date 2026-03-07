import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Trainernavbar from "./Trainernavbar";
import { Calendar, Flame, Beef, Wheat, Droplets, History, User } from "lucide-react";

const TrainerUserCalories = () => {
  const { id } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Client";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCalories();
  }, []);

  const fetchCalories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/TrackCalories/trainer/user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(res.data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <Trainernavbar />

      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center border border-gray-100">
                <User className="text-[#2bb3a3]" size={30} />
            </div>
            <div>
              <h2 className="text-slate-800 text-4xl ">{username}'s Progress</h2>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <History size={16} className="text-[#2bb3a3]" /> Calorie & Macro History
              </p>
            </div>
          </div>
          
         
        </div>

        {/* --- LOGS LIST --- */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-20 text-[#2bb3a3] font-bold">Loading nutrition data...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <Flame className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No calorie logs found for this user</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-md transition-all group"
              >
                {/* Date Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Calendar className="text-[#e67e22]" size={20} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">
                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="bg-[#e8f7f6] px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Flame className="" size={18} />
                    <span className=" font-black">{log.totalCalories} kcal</span>
                  </div>
                </div>

                {/* Macro Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Protein */}
                  <div className="bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-[#2bb3a3]/20 transition-all">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                    
                      <span className="text-[10px] font-black uppercase tracking-widest">Protein</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{log.totalProtein}<span className="text-sm ml-1 text-slate-400">g</span></p>
                  </div>

                  {/* Carbs */}
                  <div className="bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-[#2bb3a3]/20 transition-all">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                     
                      <span className="text-[10px] font-black uppercase tracking-widest">Carbohydrates</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{log.totalCarb}<span className="text-sm ml-1 text-slate-400">g</span></p>
                  </div>

                  {/* Fat */}
                  <div className="bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-[#2bb3a3]/20 transition-all">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
             
                      <span className="text-[10px] font-black uppercase tracking-widest"> Fats</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{log.totalFat}<span className="text-sm ml-1 text-slate-400">g</span></p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerUserCalories;