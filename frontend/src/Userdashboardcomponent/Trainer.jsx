import React, { useState, useEffect } from "react";
import { Star, Mail, Lock, ChevronRight, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Trainer = ({ data }) => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/trainers");
        if (res.data.success) setTrainers(res.data.trainers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div className="w-full mt-10 px-4">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#e8f7f6] rounded-lg">
              <Users className="text-[#2bb3a3]" size={24} />
            </div>
            <h2 className="text-2xl ">Expert Trainers</h2>
          </div>
          <p className="text-slate-500 text-lg font-medium ml-1">
            Top-rated professionals to accelerate your results.
          </p>
        </div>
        
      
      </div>

      {/* --- TRAINER GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {loading ? (
          <div className="col-span-full py-20 text-center text-[#2bb3a3] font-bold">Finding best trainers...</div>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white group rounded-[2.5rem] p-5 border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative w-full h-[280px] rounded-[2rem] overflow-hidden mb-6">
                {trainer.image ? (
                  <img
                    src={trainer.image}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    alt={trainer.name}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Users size={48} className="text-slate-300" />
                  </div>
                )}
                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="text-orange-400 fill-orange-400" />
                  <span className="font-bold text-slate-800 text-sm">4.9</span>
                </div>
              </div>

              {/* Info Section */}
              <div className="px-2 flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl text-slate-800 group-hover:text-[#2bb3a3] transition-colors">
                    {trainer.name}
                  </h3>
                  <Award size={20} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <p className="text-[#2bb3a3] font-bold text-sm uppercase tracking-wider mb-4">
                  {trainer.specialistTrainer || "Fitness Specialist"}
                </p>

                <div className="flex items-center gap-4 py-4 border-t border-gray-50 text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#2bb3a3] rounded-full"></div>
                    190+ Sessions
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Expert Level
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-4">
                {data?.active ? (
                  <button
                    onClick={() =>
                      navigate(`/userhome/chat/${trainer.id}`, {
                        state: { trainerName: trainer.name },
                      })
                    }
                    className="w-full bg-[#e67e22] flex items-center justify-center gap-2 hover:bg-[#229e8f] text-[#fdf3e7] rounded-2xl py-4 font-bold shadow-lg shadow-[#2bb3a3]/20 transition-all active:scale-95"
                  >
                    <Mail size={18} />
                    Message Trainer
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/userhome/userpayment")}
                    className="w-full bg-slate-800 flex items-center justify-center gap-2 hover:bg-slate-900 text-white rounded-2xl py-4 font-bold shadow-lg transition-all active:scale-95"
                  >
                    <Lock size={18} />
                    Unlock Expert Access
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trainer;