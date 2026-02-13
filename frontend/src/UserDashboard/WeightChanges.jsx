import React, { useEffect, useState } from "react";
import axios from "axios";
import { Scale, Calendar, TrendingUp } from "lucide-react";

const WeightChanges = () => {
  const [weight, setWeight] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch weight history
  const fetchWeightHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/weightchanges/weight-history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWeightHistory();
  }, []);

  // Add / Update weight
  const handleUpdateWeight = async () => {
    if (!weight) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:4000/api/weightchanges/update-weight",
        { weight: Number(weight) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWeight("");
      fetchWeightHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-white text-3xl font-bold mb-6 text-center">
        Weight Tracker
      </h2>

      {/* Add weight card */}
      <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-gray-700 shadow-lg mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600 flex-1 min-w-[220px]">
          <Scale size={20} className="text-[#C7F045]" />
          <input
            type="number"
            placeholder="Enter new weight (kg)"
            className="bg-transparent outline-none text-white w-full"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdateWeight}
          disabled={loading}
          className="bg-[#C7F045] hover:bg-[#b7db39] transition-all text-black px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Weight"}
        </button>
      </div>

      {/* Weight history */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item, index) => (
          <div
            key={item._id}
            className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-700 shadow hover:scale-105 transition-transform"
          >
            <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#C7F045]" />
              Entry #{history.length - index}
            </h3>

            <div className="flex items-center gap-3 mb-2 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600">
              <Scale size={18} className="text-[#C7F045]" />
              <span className="text-gray-300">{item.weight} kg</span>
            </div>

            <div className="flex items-center gap-3 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600">
              <Calendar size={18} className="text-[#C7F045]" />
              <span className="text-gray-400 text-sm">
                {new Date(item.recordedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightChanges;
