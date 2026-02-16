import React from "react";
import { useNavigate } from "react-router-dom";

const TrackChanges = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <button
        className="text-[#C7F045] border border-[#C7F045] px-4 py-2 rounded hover:bg-[#C7F045] hover:text-black transition"
        onClick={() => navigate("/userhome/weightchanges")}
      >
        Track Weight Changes
      </button>

      <button
        className="text-[#C7F045] border border-[#C7F045] px-4 py-2 rounded hover:bg-[#C7F045] hover:text-black transition"
        onClick={() => navigate("/userhome/exercisepr")}
      >
        Track Exercise PR
      </button>
    </div>
  );
};

export default TrackChanges;
