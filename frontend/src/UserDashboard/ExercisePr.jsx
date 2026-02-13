import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dumbbell, Hash, Calendar } from "lucide-react";

const ExercisePr = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [prData, setPrData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/exercises/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExerciseList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPRs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/pr/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExercises();
    fetchPRs();
  }, []);

  const handleAddPR = async () => {
    if (!selectedExercise || !weight || !reps) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/pr/add",
        { exerciseId: selectedExercise, weight: Number(weight), reps: Number(reps) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWeight("");
      setReps("");
      fetchPRs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-white text-3xl font-bold mb-6 text-center">My Exercise PRs</h2>

      {/* Add PR form */}
      <div className="bg-[#1f1f1f] p-6 rounded-2xl shadow-lg border border-gray-700 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <select
          className="p-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 flex-1 min-w-[200px]"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">Select Exercise</option>
          {exerciseList.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name} ({ex.targetMuscle})
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600">
            <Dumbbell size={18} className="text-[#C7F045]" />
            <input
              type="number"
              placeholder="Weight"
              className="bg-transparent outline-none text-white w-20"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600">
            <Hash size={18} className="text-[#C7F045]" />
            <input
              type="number"
              placeholder="Reps"
              className="bg-transparent outline-none text-white w-16"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleAddPR}
          className="bg-[#C7F045] hover:bg-[#b7db39] transition-all text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add PR
        </button>
      </div>

      {/* Existing PR logs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prData.map((pr) => (
          <div
            key={pr._id}
            className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-700 shadow hover:scale-105 transition-transform"
          >
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Dumbbell size={20} className="text-[#C7F045]" /> {pr.exerciseId.name}
            </h3>
            {pr.logs
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 mb-2 p-2 bg-[#2a2a2a] rounded-lg border border-gray-600"
                >
                  <Calendar size={16} className="text-[#C7F045]" />
                  <span className="text-gray-300 text-sm">
                    {new Date(log.date).toLocaleDateString()}
                  </span>

                  <Dumbbell size={16} className="text-[#C7F045]" />
                  <span className="text-gray-300 text-sm">{log.weight} kg</span>

                  <Hash size={16} className="text-[#C7F045]" />
                  <span className="text-gray-300 text-sm">{log.reps} reps</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePr;
