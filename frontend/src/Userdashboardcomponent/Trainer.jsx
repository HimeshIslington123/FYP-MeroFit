import React, { useState } from "react";
import { Star, Mail,Lock } from "lucide-react";
import boy1 from "../assets/boy-1.jpg";
import boy2 from "../assets/boy-2.jpg";
import lady1 from "../assets/lady-1.jpg";
import lady2 from "../assets/lady-2.jpg";
import DoughnutGraph from "./Dongut";
import {  useNavigate } from "react-router-dom";
const Trainer = ({data}) => {

  const navigate=useNavigate()

 
  const user = [
    { name: "Alexgendra korels", Special: "Body building", img: boy1 },
    { name: "Manita luitel", Special: "Weight loss", img: lady2 },

    { name: "Biharish joosh", Special: "Diet specalist", img: boy2 },
  ];
  return (
    <>
      <div className="flex w-full mt-[20px]">
        {/* <div className="flex-[1] h-[300px]">
          <DoughnutGraph></DoughnutGraph>
         
        </div> */}

        <div className="flex-[3] p-[10px] border-0 rounded-2xl cursor-pointer group">
          <div className="w-full flex justify-between items-center">
            <div>
              <h2 className="text-[20px]">Recommended Trainers</h2>
              <h2 className="text-[15px] text-white/60">
                Top-rated professionals for your goals
              </h2>
            </div>
            <button
              className="bg-sky-300 w-[100px] h-[30px] text-black shadow-[0_0_20px_#38bdf8] hover:shadow-[0_0_30px_#38bdf8] 
 rounded-xl"
            >
              View more
            </button>
          </div>

          <div className="flex flex-wrap justify-between w-full gap-4 mt-4">
            {user.map((trainer) => (
              <div
                key={trainer.name}
                className="bg-[#1A1A1A] w-[30%] flex flex-col px-[20px] items-start py-[10px]  h-[400px]  rounded-xl"
              >
                <img
                  src={trainer.img}
                  className="w-full h-[250px] object-cover object-center rounded-lg"
                  alt={trainer.name}
                />
                <h3 className="text-white mt-2 text-[20px]"> {trainer.name}</h3>
                <p className="text-[#C7F045] text-sm">{trainer.Special}</p>
                <div className="flex w-full justify-between mt-[10px]">
                  <div className="flex justify-between items-center gap-[5px]">
                    <Star size={16} className="text-[#C7F045] fill-[#C7F045]" />{" "}
                    4.9{" "}
                  </div>{" "}
                  <p className="text-white/30">190+ session</p>
                </div>

                {data.active?  <button className="w-full bg-[#C7F045] mt-[5px] flex items-center justify-center hover:bg-[#b3d93d] text-black rounded-xl py-3 shadow-[0_0_15px_rgba(199,240,69,0.3)] hover:shadow-[0_0_25px_rgba(199,240,69,0.5)] transition-all">
                  <Mail size={16} className="mr-2" />
                  Contact Trainer
                </button>: <button onClick={()=>navigate("/userhome/userpayment")} className="w-full bg-[#C7F045] mt-[5px] flex items-center justify-center hover:bg-[#b3d93d] text-black rounded-xl py-3 shadow-[0_0_15px_rgba(199,240,69,0.3)] hover:shadow-[0_0_25px_rgba(199,240,69,0.5)] transition-all">
                 <Lock size={16} className="mr-2" />
                 Unlock
                </button>}
               

                  
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trainer;
