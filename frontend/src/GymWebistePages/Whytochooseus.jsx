import React from "react";
import girl from "../assets/gym_lady.jpg";
import boy from "../assets/gym_trainer.png";
import nutrioton from "../assets/nutrion.jpg";
import moto1 from "../assets/moto-1.avif";
import moto2 from "../assets/moto-2.avif";
import moto3 from "../assets/moto-3.avif";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Whytochooseus = () => {
  return (
    <>
      <Header />
      <div className="flex p-[15px] w-full flex-col justify-center items-center">
        {/* OUR PEOPLE SECTION */}
        <h1 className="text-[28px] w-[75%] text-center md:text-[40px] font-semibold">
          OUR PEOPLE
        </h1>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-5">
          <img
            className="h-[150px] w-[200px] md:h-[400px] md:w-[300px] rounded-xl object-cover"
            src={girl}
          />
          <img
            className="h-[150px] w-[200px] md:h-[400px] md:w-[300px] rounded-xl object-cover"
            src={boy}
          />
          <img
            className="h-[150px] w-[200px] md:h-[400px] md:w-[300px] rounded-xl object-cover"
            src={nutrioton}
          />
        </div>

        <p className="text-center mt-[10px] text-[15px] mb-[15px] md:text-[20px] md:w-[60%] w-[80%]">
          At Athlete Land, our strength comes from our people. With{" "}
          <span className="text-[20px] md:text-[30px]">20+</span>{" "}
          <span className="text-amber-700">
            expert trainers, certified nutritionists, and a passionate support
            staff
          </span>
          , we’re more than a gym—we’re a community built to inspire, motivate,
          and transform.
        </p>

        {/* OUR MOTO SECTION */}
        <h1 className="text-[28px] w-[75%] text-center md:text-[40px] font-semibold">
          OUR MOTO
        </h1>

        <div className="w-full flex flex-col md:flex-row justify-center gap-[15px] items-center">
          {/* CARD 1 */}
          <div className="bg-gray-100 p-[10px] h-auto md:h-[550px] w-[75%] md:w-[25%] rounded-xl flex flex-col justify-between items-center shadow-md">
            <img className="w-[50%] md:w-[70%] object-cover" src={moto1} />
            <div>
              <h3 className="text-[15px] md:text-[20px] my-[5px] text-center font-semibold text-gray-900">
                100% Member Satisfaction Guaranteed
              </h3>
              <p className="text-[12px] md:text-[15px] mb-[10px] text-center">
                Your fitness journey is our top priority. We’re committed to
                creating a motivating, friendly, and result-driven environment
                where every member feels valued.{" "}
                <span className="text-amber-700">
                  From personalized training programs to supportive trainers,
                </span>{" "}
                we make sure you leave every session one step closer to your
                goal.
              </p>
            </div>
            <button className="bg-amber-500 text-white cursor-pointer transition duration-500 hover:bg-neutral-800 font-medium rounded-2xl md:py-[10px] md:px-[20px] py-[5px] px-[10px]">
              Join Now
            </button>
          </div>

          {/* CARD 2 */}
          <div className="bg-gray-100 p-[10px] h-auto md:h-[550px] w-[75%] md:w-[25%] rounded-xl flex flex-col justify-between items-center shadow-md">
            <img className="w-[50%] md:w-[70%] object-cover" src={moto2} />
            <div>
              <h3 className="text-[15px] md:text-[20px] my-[5px] text-center font-semibold text-gray-900">
                Secure Payments — Cash or Online
              </h3>
              <p className="text-[12px] md:text-[15px] mb-[10px] text-center">
                We believe in convenience and transparency. That’s why our
                payment system is completely secure — whether you prefer paying
                in cash or online. Enjoy peace of mind knowing your transactions
                are fast, safe, and hassle-free.
              </p>
            </div>
            <button className="bg-amber-500 text-white cursor-pointer transition duration-500 hover:bg-neutral-800 font-medium rounded-2xl md:py-[10px] md:px-[20px] py-[5px] px-[10px]">
              View Payment Options
            </button>
          </div>

          {/* CARD 3 */}
          <div className="bg-gray-100 p-[10px] h-auto md:h-[550px] w-[75%] md:w-[25%] rounded-xl flex flex-col justify-between items-center shadow-md">
            <img className="w-[50%] md:w-[70%] object-cover" src={moto3} />
            <div>
              <h3 className="text-[15px] md:text-[20px] my-[5px] text-center font-semibold text-gray-900">
                24/7 Online Consultation & Helpline Support
              </h3>
              <p className="text-[12px] md:text-[15px] mb-[10px] text-center">
                Your fitness doesn’t stop at the gym, and neither do we. Our
                experts are available 24/7 to guide, motivate, and support you —
                no matter where you are or what time it is.
              </p>
            </div>
            <button className="bg-amber-500 text-white cursor-pointer transition duration-500 hover:bg-neutral-800 font-medium rounded-2xl md:py-[10px] md:px-[20px] py-[5px] px-[10px]">
              Chat with Us
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Whytochooseus;
