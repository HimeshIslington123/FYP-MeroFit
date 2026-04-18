import React, { useState } from "react";
import gymlogo from "../assets/image.png";
import { useNavigate } from "react-router-dom";

const Userheader = () => {
  const navigate = useNavigate();
  const [navLink, setNavLink] = useState("Home");

  const links = [
    { name: "Home", icon: "bi bi-house-door-fill", path: "home" },
    { name: "Profile", icon: "bi bi-person-circle", path: "profile" },
    { name: "Analysis", icon: "bi bi-graph-down", path: "analysis" },

    {
      name: "Track Calories",
      icon: "bi bi-clipboard2-data",
      path: "trackcalories",
    },
    { name: "Message", icon: "bi bi-chat-left-dots", path: "chat" },
    { name: "Community", icon: "bi bi-people", path: "post" },
    { name: "Badge", icon: "bi bi-people", path: "badge" },
    { name: "Progress logs", icon: "bi bi-people", path: "compare" },
        { name: "View payment history", icon: "bi bi-people", path: "history" },
   
  ];

  return (
    <div className="h-[100vh] w-full bg-white flex flex-col justify-between border-r border-gray-300">
      {/* Logo Section */}
      <div className="flex flex-col gap-[40px]">
        <div className="py-4 flex justify-center">
          <img
            className="rounded-full border border-black w-[130px] h-[130px] object-cover"
            src={gymlogo}
            alt="Gym Logo"
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-3 px-6">
          {links.map((link) => (
            <div
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setNavLink(link.name);
              }}
              className={`flex items-center p-2 rounded-md gap-3 cursor-pointer  ${
                navLink === link.name
                  ? "bg-[#e8f7f6] text-[#229e8f] border-[#229e8f]"
                  : "text-gray-700 border-transparent hover:bg-[#f1f2f2] hover:text-black"
              }`}
            >
              <i className={link.icon}></i>
              <span>{link.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 px-6 mb-6 border-t border-gray-300 pt-4">
        <div
          onClick={() => {
            navigate("/logout");
            setNavLink("Logout");
          }}
          className={`flex items-center gap-3 cursor-pointer p-2 rounded-md  ${
            navLink === "Logout"
              ? "bg-[#e8f7f6] text-[#229e8f] border-[#229e8f]"
              : "text-gray-700 border-transparent hover:bg-[#f1f2f2] hover:text-black"
          }`}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Userheader;
