import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dumbbell, Plus, Award, ArrowLeft, X, Calendar, Hash, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExercisePr = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [prData, setPrData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllData = async () => {
    try {
      const [exRes, prRes] = await Promise.all([
        axios.get("http://localhost:4000/api/exercises/", { headers }),
        axios.get("http://localhost:4000/api/pr/", { headers })
      ]);
      setExerciseList(exRes.data);
      setPrData(prRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

const handleAddPR = async () => {

  if (!selectedExercise) {
    alert("Please select an exercise");
    return;
  }

  if (!weight) {
    alert("Please enter weight");
    return;
  }

  if (weight <= 0) {
    alert("Weight must be greater than 0");
    return;
  }

  if (!reps) {
    alert("Please enter reps");
    return;
  }

  if (reps <= 0) {
    alert("Reps must be greater than 0");
    return;
  }

  try {
    await axios.post(
      "http://localhost:4000/api/pr/add",
      {
        exerciseId: selectedExercise,
        weight: Number(weight),
        reps: Number(reps)
      },
      { headers }
    );

    alert("PR added successfully ");

    // reset fields
    setWeight("");
    setReps("");
    setSelectedExercise("");

    fetchAllData();

  } catch (err) {
    console.error(err);
    alert("Something went wrong ");
  }
};

  const openHistory = (exercise) => {
    setActiveExercise(exercise);
    setShowModal(true);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-[#2bb3a3] ">Loading PRs...</div>;

  return (
    <div className=" bg-[#f8fafb] p-5  relative">
      <div className="max-w-6xl mx-auto">
        
      
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-[#2bb3a3] font-bold group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
              Back
            </button>
            <h2 className=" text-2xl">Exercise PRs</h2>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-[#e8f7f6] rounded-2xl"><Award className="text-[#2bb3a3]" size={28} /></div>
            <div >
              <p className="text-slate-400 text-xs font-bold uppercase">Personal Bests</p>
              <p className="text-2xl font-bold text-slate-800">{prData.length}</p>
            </div>
          </div>
        </div>

        {/* ADD PR FORM */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-1">
              <label className="text-slate-400 text-xs font-bold mb-2 block uppercase tracking-wide">Exercise</label>
              <select 
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 outline-none font-semibold text-slate-700 appearance-none"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                <option value="">Select exercise...</option>
                {exerciseList.map(ex => <option key={ex._id} value={ex._id}>{ex.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold mb-2 block text-center uppercase tracking-wide">Weight (kg)</label>
              <input type="number" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-center font-bold text-2xl text-[#2bb3a3]" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold mb-2 block text-center uppercase tracking-wide">Reps</label>
              <input type="number" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-center font-bold text-2xl" value={reps} onChange={(e) => setReps(e.target.value)} />
            </div>
            <button onClick={handleAddPR} className="bg-[#2bb3a3] text-white font-bold py-5 rounded-2xl shadow-lg shadow-[#2bb3a3]/20 hover:bg-[#229e8f] transition-all active:scale-95">Add Record</button>
          </div>
        </div>

        {/* PR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prData.map((pr) => (
            <div 
              key={pr._id} 
              onClick={() => openHistory(pr)}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#e8f7f6] transition-colors"><Dumbbell size={24} className="text-[#2bb3a3]" /></div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{pr.exerciseId.name}</h3>
              </div>

              <div className="space-y-4">
                {pr.logs.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 2).map((log, idx) => (
                  <div key={idx} className={`p-4 rounded-[1.5rem] border flex items-center justify-between ${idx === 0 ? 'bg-[#fcfdfd] border-[#e8f7f6]' : 'bg-white border-gray-50'}`}>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(log.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#2bb3a3]">{log.weight}kg</span>
                        <span className="text-slate-200">|</span>
                        <span className="text-xl font-bold text-slate-700">{log.reps} <span className="text-xs font-normal">reps</span></span>
                      </div>
                    </div>
                    {idx === 0 && <Award size={20} className="text-[#2bb3a3]" />}
                  </div>
                ))}
              </div>

              {pr.logs.length > 2 && (
                <p className="mt-6 pt-4 border-t border-gray-50 text-center text-[10px] text-[#2bb3a3] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-1">
                  View {pr.logs.length - 2} more records <ChevronRight size={12} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FULL HISTORY MODAL */}
      {showModal && activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{activeExercise.exerciseId.name}</h2>
                <p className="text-slate-400 font-medium mt-1">Full Performance History</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-gray-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
              {activeExercise.logs.sort((a,b) => new Date(b.date) - new Date(a.date)).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-transparent hover:border-[#2bb3a3]/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${idx === 0 ? 'bg-[#2bb3a3] text-white' : 'bg-white text-slate-400'}`}>
                      {idx === 0 ? <Award size={20} /> : <Calendar size={20} />}
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-xl">{log.weight} <span className="text-sm font-medium">kg</span></p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{new Date(log.date).toLocaleDateString(undefined, {dateStyle: 'long'})}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2bb3a3] font-black text-2xl">{log.reps}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Reps</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-gray-50/50 text-center">
              <button onClick={() => setShowModal(false)} className="px-10 py-4 bg-white border border-gray-100 text-slate-500 font-bold rounded-2xl hover:bg-white hover:shadow-md transition-all">Close History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePr;