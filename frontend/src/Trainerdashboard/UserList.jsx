import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrainerNavbar from "./Trainernavbar";
import { User, Activity, MessageCircle, ChevronRight, Search, Users } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/users/users-with-payment",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const filteredUsers = users.filter((u) => 
    u.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <TrainerNavbar />
      
      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-slate-800 text-3xl">Client Roster</h2>
            <p className="text-slate-500 text-lg mt-2 font-medium">Manage your active gym members and their progress.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none font-medium"
            />
          </div>
        </div>

        {/* --- USER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((item) => (
            <div
              key={item.user._id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.membershipStatus === 'active' 
                  ? "bg-emerald-50 text-emerald-500" 
                  : "bg-orange-50 text-orange-500"
                }`}>
                  {item.membershipStatus}
                </span>
              </div>

              {/* User Identity */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
                
                    <User size={32} className="text-slate-300" />
                  
                </div>
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-[#2bb3a3] transition-colors">{item.user.name}</h3>
                <p className="text-[#2bb3a3] font-bold text-xs uppercase tracking-widest mt-1">Goal: {item.user.goal || "General Fitness"}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/trainer/user/${item.user._id}`)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-[#e8f7f6] rounded-2xl transition-all group/btn"
                >
                  <div className="flex items-center gap-3">
                    
                    <span className="font-bold text-slate-700 text-sm">View Details</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>

                <button
                  onClick={() => navigate(`/trainer/user/${item.user._id}/calories`, { state: { username: item.user.name } })}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-[#e8f7f6] rounded-2xl transition-all group/btn"
                >
                  <div className="flex items-center gap-3">
                  
                    <span className="font-bold text-slate-700 text-sm">Check Calories</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>

                <button
                  onClick={() => navigate(`/trainerchat/${item.user._id}`)}
                  className="w-full mt-4 bg-[#2bb3a3] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2bb3a3]/20 hover:bg-[#229e8f] active:scale-95 transition-all"
                >
                  <MessageCircle size={18} />
                  Chat with User
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
               <Users size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default UserList;