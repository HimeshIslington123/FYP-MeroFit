import React from "react";
import gym from "../assets/gymImage.jpg";
import girl from "../assets/gym_lady.jpg";
import boy from "../assets/gym_trainer.png";
import nutrioton from "../assets/nutrion.jpg";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
  const navigate=useNavigate();
  return (
    <><Header></Header>
    <div className="p-[15px] w-full">

        {/* text section */}
      <div className="text-center">
        <h1 className="text-[22px] md:text-[40px] m-0 font-semibold">
          WE ARE GYM AND FITNESS
        </h1>

        <h3 className="text-[22px] leading-tight md:text-[40px] m-0 mt-[-5px] font-light">
          More than just your average fitness retailer
        </h3>
      </div>


{/* Image sextion */}
<div className="w-full mt-[20px] mb-[10px] flex justify-center items-center  md:h-[500px] h-[300px]">
    <img className="object-cover h-full md:w-[60%] w-[80%]" src={gym}></img>
</div>

{/* Our story */}

<div className="flex flex-col justify-center items-center ">
    <h1 className="text-[22px] text-center md:text-[40px] m-0 font-semibold">OUR STORY</h1>
    <p className="text-center text-[15px] mb-[15px]  md:text-[20px] md:text-justify    md:w-[60%] w-[80%]">
        <span className="text-red-300 font-bold md:text-[30px] text-[20px]">Every</span> journey begins with a single step, and ours started with a simple idea: to create a space where strength isn’t just measured in weights, but in courage, determination, and heart. At [Gym Name], we believe fitness is more than reps and sets—it’s about transforming your life, breaking limits, and discovering what you’re truly capable of.
<br></br><br></br>
From the first time you walk through our doors, you’ll feel it—the energy, the passion, the relentless drive that fills every corner. It’s a place where beginners and pros train side by side, where every drop of sweat tells a story, and every challenge conquered builds confidence that carries far beyond the gym walls. We’re here to remind you that the only competition that matters is the person you were yesterday.
<br></br><br></br>

Step in, embrace the challenge, and unleash your potential. The journey won’t always be easy—but nothing worth achieving ever is. Sweat, struggle, grow, repeat—and watch yourself transform, one powerful rep at a time.
    </p>
    <button onClick={()=>(navigate("/whytochooseus"))} className="text-[15px] md:text-[20px] text-white bg-amber-500 border cursor-pointer border-black p-[10px] rounded-2xl">Why to choose us?</button>
</div>

<div className="flex justify-center mt-[20px] ">
    <div className="h-[1px]  w-[70%] md-w-[60%] rounded-2xl bg-black"></div>
</div>

{/* Our people*/}


    </div>
    <Footer></Footer>
  </>);
  
};

export default AboutUs;
