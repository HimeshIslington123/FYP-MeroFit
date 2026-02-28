import React from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Trophy } from "lucide-react";

const TrackChanges = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Weight Tracker Card */}
      <div 
        onClick={() => navigate("/userhome/weightchanges")}
        className="flex-1 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 cursor-pointer"
      >
        <div className="p-3 bg-orange-50 w-fit rounded-xl mb-6">
          <Scale className="text-[#e67e22]" size={24} />
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Progress</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">Weight Tracker</h3>
        <p className="text-slate-400 text-sm mt-2">Log your daily weight changes.</p>
      </div>

      {/* Exercise PR Card */}
      <div 
        onClick={() => navigate("/userhome/exercisepr")}
        className="flex-1 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 cursor-pointer"
      >
        <div className="p-3 bg-[#e8f7f6] w-fit rounded-xl mb-6">
          <Trophy className="text-[#2bb3a3]" size={24} />
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Strength</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">Exercise PRs</h3>
        <p className="text-slate-400 text-sm mt-2">Track your personal records.</p>
      </div>
    </div>
  );
};

export default TrackChanges;