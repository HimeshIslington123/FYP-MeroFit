import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dumbbell } from "lucide-react";

const Exercise = ({ fitnesstype, limit }) => {
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:4000/api/exercises/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExerciseList(res.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <h2 className="text-white text-center mt-10">Loading exercises...</h2>;

  const level = fitnesstype || "Beginner";

  // Filter exercises based on fitness level
  let filteredExercises = exerciseList.filter(
    (ex) => ex.level.toLowerCase() === level.toLowerCase()
  );

  // Apply limit if provided
  if (limit) {
    filteredExercises = filteredExercises.slice(0, limit);
  }

  return (
    <div className="">
      {filteredExercises.length === 0 ? (
        <p className="text-white text-center mt-10">No exercises found for this level.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredExercises.map((ex) => (
           <div
  key={ex._id}
  className="bg-[#1A1A1A] border-0 p-6 rounded-2xl 
             transition-all duration-300 
             hover:scale-105 cursor-pointer group"
>
  <div className="flex items-center justify-start mb-4">
    <div className="p-3 bg-[#C7F045]/10 rounded-xl group-hover:bg-[#C7F045]/20 transition-colors flex items-center">
      <Dumbbell size={15} className="text-[#C7F045]" />
      <span className="ml-2 text-white font-light">{ex.level}</span>
    </div>
  </div>
  <h3 className="text-white font-semibold text-lg mb-2">{ex.name}</h3>
  <p className="text-gray-300">
    <strong>Muscle:</strong> {ex.targetMuscle}
  </p>
</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default Exercise;
