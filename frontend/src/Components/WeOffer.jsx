import React from "react";
import gym from "../assets/gymImage.jpg";
import cardio from "../assets/cardio.webp";
import swimming from "../assets/swimming.jpg";
import sauna from "../assets/sauna.jpg";
import bodybuilder from "../assets/bodybuilder.png";
import { useNavigate } from "react-router-dom";

const WeOffer = () => {
    const navigate = useNavigate();
  
  const offers = [
    { id:1,name: "GYM", image: gym },
    { id:2,name: "CARDIO", image: cardio },
    { id:3,name: "SAUNA", image: sauna },
    { id:4,name: "SWIMMING", image: swimming },
  ];

  const features = [
    "Free parking",
    "Referral (refer friends)",
    "Locker & shower facility",
    "Free first training session",
    "Certified personal trainers",
    "Fitness assessment & body analysis",
    "Free protein shake for new members",
    
  ];

  return (
    <div className="w-full px-6 py-10 bg-gray-100 text-black">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-light">
          What we offer  <span className="text-orange-500 text-4xl">?</span>
        </h1>
      </div>

      {/* Offer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {offers.map((item, index) => (
          <div
            key={index}
            className="relative w-[280px] h-[380px] rounded-xl overflow-hidden shadow-lg group"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition duration-500">
              <h5 className="text-3xl font-bold text-orange-400 mb-2">
                {item.name}
              </h5>
              <button onClick={()=>navigate(`/Whatweoffer/${item.id}`)} className="border-2 cursor-pointer border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
                View Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="flex flex-col md:flex-row mt-16 items-center md:items-stretch">
       

        {/* Right Features */}
        <div className=" flex w-full flex-col justify-center p-6">
          <h2 className="text-4xl font-light text-center  mb-6">
            Special Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <p
                key={index}
                className="text-lg  p-[10px] cursor-pointer bg-gray-200 text-center rounded-xl hover:text-orange-500 transition"
              >
                {feature}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeOffer;
