import React, { useEffect, useState } from "react";
import axios from "axios";
import { Scale, Calendar, TrendingDown, ArrowLeft, Plus, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WeightChanges = () => {
  const [weight, setWeight] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWeightHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/weightchanges/weight-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort history by newest first
      setHistory(res.data.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchWeightHistory(); }, []);

  const handleUpdateWeight = async () => {
  if (!weight || weight <= 0) {
    alert("Please enter a valid weight");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:4000/api/weightchanges/update-weight",
      { weight: Number(weight) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setWeight("");
    fetchWeightHistory();
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  // Logic for the header stats
  const startWeight = history.length > 0 ? history[history.length - 1].weight : 0;
  const currentWeight = history.length > 0 ? history[0].weight : 0;
  const totalChange = (currentWeight - startWeight).toFixed(1);

  return (
    <div className=" bg-[#f8fafb] p-6 ">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-[#2bb3a3] hover:text-[#229e8f] font-bold transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
              Back
            </button>
            <h2 className="text-2xl">Weight Tracker</h2>
            <p className="text-slate-500 text-lg mt-2 font-medium">Small steps lead to big results.</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 min-w-[300px]">
            <div className="p-4 bg-orange-50 rounded-2xl">
              <TrendingDown className="text-[#e67e22]" size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Progress</p>
              <p className="text-3xl font-bold text-slate-800">
                {totalChange > 0 ? `+${totalChange}` : totalChange} <span className="text-sm font-semibold">kg</span>
              </p>
            </div>
          </div>
        </div>

        {/* --- ADD WEIGHT FORM (Consistent with Food Entry) --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Plus size={20} className="text-slate-800 stroke-[3px]" />
              <h3 className="text-xl font-bold text-slate-800">New Entry</h3>
            </div>
            <div className="relative">
              <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="number"
                placeholder="Enter weight in kg"
                className="w-full pl-12 pr-4 py-5 rounded-2xl border border-gray-100 bg-gray-50 h-[20px] focus:bg-white focus:ring-4 focus:ring-[#2bb3a3]/10 focus:border-[#2bb3a3] outline-none transition-all text-[15px] text-slate-700"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleUpdateWeight}
            disabled={loading}
            className="w-full md:w-auto bg-[#2bb3a3] h-[30px]  hover:bg-[#229e8f] text-white font-bold px-12  rounded-2xl transition-all shadow-lg shadow-[#2bb3a3]/20 text-center active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Weight"}
          </button>
        </div>

        {/* --- WEIGHT HISTORY GRID --- */}
        <div className="flex items-center gap-2 mb-6 ml-2">
            <History size={20} className="text-slate-400" />
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Entry History</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item, index) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-[#e8f7f6] transition-colors">
                    <Scale size={24} className="text-[#2bb3a3]" />
                </div>
                <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Entry #{history.length - index}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-5xl font-bold text-slate-800 tracking-tighter">
                    {item.weight}
                    <span className="text-lg ml-1 font-semibold text-slate-400">kg</span>
                </h3>
              </div>

              <div className=" border-t border-gray-50 flex items-center gap-2">
                <Calendar size={16} className="text-slate-300" />
                <span className="text-slate-400 text-sm font-bold">
                  {new Date(item.recordedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightChanges;