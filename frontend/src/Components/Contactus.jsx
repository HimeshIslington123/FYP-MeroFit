import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import gym1 from "../assets/gym-1.jpg";
import gym2 from "../assets/gym-2.webp";
import gym3 from "../assets/gym-3.jpg";

const Contactus = () => {
  return (
    <>
      <Header />

      <div className="p-[20px] md:p-[50px] w-full">
        <h1 className="text-center text-[30px] font-semibold mb-8">
          Our Locations
        </h1>

        {/* Location 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex-1 flex justify-center">
            <img
              className="rounded-2xl w-[100%] md:w-[85%] transition-transform duration-500 hover:scale-102 shadow-lg"
              src={gym1}
              alt="Gym Location"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start md:items-start">
            <h2 className="text-[15px] md:text-[20px] font-semibold mb-2">
              📍 Paknajol-16, Kathmandu, Nepal🇳🇵
            </h2>
            <p>📞 Contact no: 9843646034, 9484838929</p>
            <p>👨‍💼 Gym Manager: Indra kumar baniya</p>
            <button className="mt-4 bg-black cursor-pointer text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition">
              View Location
            </button>
          </div>
        </div>

        {/* Location 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-6 mb-10">
          <div className="flex-1 flex justify-center">
            <img
              className="rounded-2xl w-[100%] md:w-[85%]transition-transform duration-500 hover:scale-102 shadow-lg"
              src={gym2}
              alt="Gym Location"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start md:items-start">
            <h2 className="text-[15px] md:text-[20px] font-semibold mb-2">
              📍Aurban-73929,Sydeny,Austraila🇦🇺
            </h2>
            <p>📞 Contact no: (02) 1234 5678, (02) 12380 5678</p>
            <p>👨‍💼 Gym Manager: Harrish tison</p>
            <button className="mt-4 bg-black cursor-pointer text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition">
              View Location
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex-1 flex justify-center">
            <img
              className="rounded-2xl w-[100%] md:w-[85%] transition-transform duration-500 hover:scale-102 shadow-lg"
              src={gym3}
              alt="Gym Location"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start md:items-start">
            <h2 className="text-[15px] md:text-[20px] font-semibold mb-2">
              📍 Townhall-022,California,USA🇺🇸
            </h2>
            <p>📞 Contact no: 9843646034, 9484838929</p>
            <p>👨‍💼 Gym Manager: Ram Hari Khatueiejxn</p>
            <button className="mt-4 bg-black cursor-pointer text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition">
              View Location
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contactus;
