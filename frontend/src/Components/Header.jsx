import React, { useState } from "react";
import gymlogo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [toogle, settoogle] = useState(false);
  return (
    <>
      <div className="bg-black px-[20px] w-screen hidden overflow-hidden text-white md:h-[100px]  lg:h-[120px]  md:flex justify-between items-center">
        <div className="md:w-[80px] lg:w-[90px] lg:h-[90px] rounded-full overflow-hidden md:h-[80px]">
          <img className="h-full w-full" src={gymlogo} alt="Gym Logo" />
        </div>

        <ul className="flex flex-row justify-between font-light md:text-[15px] lg:text-[20px] items-center gap-[20px] cursor-pointer list-none">
          <li
            onClick={() => navigate("/")}
            className="hover:text-orange-300 duration-100 cursor-pointer transition"
          >
            Home
          </li>
          <li
            onClick={() => navigate("/aboutus")}
            className="hover:text-orange-300 duration-100 cursor-pointer transition"
          >
            About us
          </li>
          <li
            onClick={() => navigate("/Contactus")}
            className="hover:text-orange-300 duration-100 cursor-pointer transition"
          >
            Contact us
          </li>
          <li
            onClick={() => navigate("/blog")}
            className="hover:text-orange-300 duration-100 cursor-pointer transition"
          >
            Blog
          </li>

          <li
            onClick={() => navigate("/login")}
            className="bg-white  border border-transparent  transition duration-500 md:px-[15px] lg:px-[20px] py-[2px] rounded-[30px] hover:bg-black hover:border-amber-50 hover:text-white font-normal  text-black"
          >
            Login
          </li>
        </ul>
      </div>

      {/* for mobile */}
      <div className="bg-black px-[15px] w-screen  overflow-hidden h-[90px] text-white md:h-[100px] md:hidden  lg:h-[120px] flex justify-between items-center">
        <div className="md:w-[80px] w-[60px] h-[60px] lg:w-[90px] lg:h-[90px] rounded-full overflow-hidden md:h-[80px]">
          <img className="h-full w-full" src={gymlogo} alt="Gym Logo" />
        </div>
        <div className="">
          <div>
            {" "}
            <i
              onClick={() => settoogle(!toogle)}
              className="bi bi-list relative  text-[30px]"
            ></i>
            {toogle ? (
              <>
                <div
                  style={{ background: "#1a1a1a" }}
                  className="  absolute p-[15px] transition duration-300 z-50 left-0 mt-[20px] flex flex-col justify-between w-full h-[180px]"
                >
                  <ul className="flex flex-col text-[20px] font-normal justify-between h-full">
                    <li
                      onClick={() => navigate("/home")}
                      className="focus:text-caret-amber-400"
                    >
                      Home
                    </li>
                    <li onClick={() => navigate("/aboutus")}>About us</li>
                    <li onClick={() => navigate("/Contactus")}></li>
                    <li onClick={() => navigate("/blog")}>Blog</li>
                    <li onClick={() => navigate("/login")}>Login</li>
                  </ul>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
