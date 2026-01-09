import React, { useState } from "react";
import testdata from "../data/testimonal.js";

const Testimonal = () => {
  const [index, setIndex] = useState(0); // current testimonial index

 // next button function
const handleNext = () => {
  setIndex((prev) => (prev + 1) % testdata.length);
};

// prev button function
const handlePrev = () => {
  setIndex((prev) => (prev - 1 + testdata.length) % testdata.length);
};

  const current = testdata[index];

  return (
    <>
      <h1 className="text-[30px] text-center mt-[20px] font-semibold">
        What our members say?
      </h1>

      <div className="flex flex-col justify-center items-center mt-[30px] p-[20px]">
        {/* Testimonial Card */}
        <div className="w-[320px] h-[420px] p-[20px] rounded-xl flex flex-col justify-center items-center bg-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="border-t-[3px] border-b-[3px] border-amber-600 overflow-hidden rounded-[50%] w-[90px] h-[90px] mb-[10px]">
            <img
              className="w-full h-full object-cover"
              src={current.image}
              alt={current.name}
            />
          </div>
          <h1 className="font-semibold text-lg">{current.name}</h1>
          <p className="text-center text-sm mt-[10px] text-gray-700">
            {current.message}
          </p>
          <p className="mt-[10px] text-gray-500 text-sm">{current.joined}</p>
        </div>

        {/* Buttons */}
        <div className="flex mt-[20px] gap-[15px]">
          <button
            onClick={handlePrev}
            className="bg-amber-600 text-white px-[20px] py-[8px] rounded-md hover:bg-amber-700 transition"
          >
            previous
          </button>
          <button
            onClick={handleNext}
            className="bg-amber-600 text-white px-[20px] py-[8px] rounded-md hover:bg-amber-700 transition"
          >
            Next 
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-[6px] mt-[15px]">
          {testdata.map((_, i) => (
            <div onClick={()=>(setIndex(i))}
              key={i}
              className={`w-[10px] h-[10px] rounded-full ${
                i === index ? "bg-amber-600" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonal;
