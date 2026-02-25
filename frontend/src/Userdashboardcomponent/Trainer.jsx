import React, { useState, useEffect } from "react";
import { Star, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Trainer = ({ data }) => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/trainers"); // adjust route if needed
        if (res.data.success) setTrainers(res.data.trainers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div className="flex w-full mt-[20px]">
      <div className="flex-[3] p-[10px] border-0 rounded-2xl cursor-pointer group">
        <div className="w-full flex justify-between items-center">
          <div>
            <h2 className="text-[20px]">Recommended Trainers</h2>
            <h2 className="text-[15px] text-white/60">
              Top-rated professionals for your goals
            </h2>
          </div>
          <button className="bg-sky-300 w-[100px] h-[30px] text-black shadow-[0_0_20px_#38bdf8] hover:shadow-[0_0_30px_#38bdf8] rounded-xl">
            View more
          </button>
        </div>

        <div className="flex flex-wrap justify-between w-full gap-4 mt-4">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-[#1A1A1A] w-[30%] flex flex-col px-[20px] items-start py-[10px]  h-[400px]  rounded-xl"
            >
              {trainer.image && (
                <img
                  src={trainer.image}
                  className="w-full h-[250px] object-cover object-center rounded-lg"
                  alt={trainer.name}
                />
              )}
              <h3 className="text-white mt-2 text-[20px]">{trainer.name}</h3>
              <p className="text-[#C7F045] text-sm">
                {trainer.specialistTrainer}
              </p>
              <div className="flex w-full justify-between mt-[10px]">
                <div className="flex justify-between items-center gap-[5px]">
                  <Star size={16} className="text-[#C7F045] fill-[#C7F045]" />{" "}
                  4.9
                </div>
                <p className="text-white/30">190+ session</p>
              </div>

              {data?.active ? (
                <button
                  onClick={() =>
                   navigate(`/userhome/chat/${trainer.id}`, {
  state: { trainerName: trainer.name },
})
                  }
                  className="w-full bg-[#C7F045] mt-[5px] flex items-center justify-center hover:bg-[#b3d93d] text-black rounded-xl py-3 shadow-[0_0_15px_rgba(199,240,69,0.3)] hover:shadow-[0_0_25px_rgba(199,240,69,0.5)] transition-all"
                >
                  <Mail size={16} className="mr-2" />
                  Contact Trainer
                </button>
              ) : (
                <button
                  onClick={() => navigate("/userhome/userpayment")}
                  className="w-full bg-[#C7F045] mt-[5px] flex items-center justify-center hover:bg-[#b3d93d] text-black rounded-xl py-3 shadow-[0_0_15px_rgba(199,240,69,0.3)] hover:shadow-[0_0_25px_rgba(199,240,69,0.5)] transition-all"
                >
                  <Lock size={16} className="mr-2" />
                  Unlock
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trainer;
