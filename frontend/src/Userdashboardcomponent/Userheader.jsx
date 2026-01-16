import React, { useState } from "react";
import gymlogo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

const Userheader = () => {
  const navigate = useNavigate();
  const [navLink, setNavLink] = useState("Home");

  return (
    <>
      <div className="h-[100vh] w-full bg-black flex flex-col justify-between">
        {/* Logo Section */}
        <div className="flex flex-col gap-[40px]">
          <div className="py-4 flex justify-center">
            <img
              className="rounded-full border border-amber-50 w-[80px] h-[80px] object-cover"
              src={gymlogo}
              alt="Gym Logo"
            />
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-5 px-6">
            {/* Home */}
            <div
              onClick={() => {
                navigate("home");
                setNavLink("Home");
              }}
              className={`${
                navLink === "Home"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[orange]`}
            >
              <i className="bi bi-house-door-fill"></i>
              <span>Home</span>
            </div>

            {/* Profile */}
            <div
              onClick={() => {
                navigate("userprofile");
                setNavLink("Profile");
              }}
              className={`${
                navLink === "Profile"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-person-circle"></i>
              <span>Profile</span>
            </div>

            {/* Analysis */}
            <div
              onClick={() => {
                navigate("analysis");
                setNavLink("Analysis");
              }}
              className={`${
                navLink === "Analysis"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-graph-down"></i>
              <span>Analysis</span>
            </div>


            {/* Analysis */}
            <div
              onClick={() => {
                navigate("compare");
                setNavLink("Compare");
              }}
              className={`${
                navLink === "Compare"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-graph-down"></i>
              <span>Compare</span>
            </div>

            {/* Track Calories */}
            <div
              onClick={() => {
                navigate("trackcalories");
                setNavLink("Track Calories");
              }}
              className={`${
                navLink === "Track Calories"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-clipboard2-data"></i>
              <span>Track Calories</span>
            </div>

            {/* Message */}
            <div
              onClick={() => {
                navigate("message");
                setNavLink("Message");
              }}
              className={`${
                navLink === "Message"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-chat-left-dots"></i>
              <span>Message</span>
            </div>


             {/* caloires */}
            <div
              onClick={() => {
                navigate("calories");
                setNavLink("calories");
              }}
              className={`${
                navLink === "calories"
                  ? "bg-[#D8FF00] text-black"
                  : "text-white"
              } flex items-center p-[8px] rounded-[5px] gap-3 cursor-pointer hover:text-[#D8FF00]`}
            >
              <i className="bi bi-chat-left-dots"></i>
              <span>Calories</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 px-6 mb-6">
          <div className="flex items-center text-white gap-3 cursor-pointer hover:text-[#C7F045]">
            <i className="bi bi-lock"></i>
            <span>Security</span>
          </div>

          <div className="flex items-center text-white gap-3 cursor-pointer hover:text-[#C7F045]">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userheader;
