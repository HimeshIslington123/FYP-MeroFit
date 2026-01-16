import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Userheader from "../Userdashboardcomponent/Userheader";


const Userhome = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        {/* Sidebar */}
        <div className="w-64 h-screen fixed">
          <Userheader />
        </div>

        {/* Content area */}
        <div className="flex-1 ml-64 bg-neutral-900 p-6 overflow-y-auto h-screen">
          <Outlet />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden h-screen bg-neutral-900 relative">
       
        <div className="flex items-center justify-between p-4 bg-neutral-800">
          <button onClick={() => setIsOpen(true)}>
            <Menu className="text-white w-6 h-6" />
          </button>
        </div>

      
        <div
          className={`fixed top-0 left-0 overflow-y-auto h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full" 
          } z-50`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-white text-lg  font-semibold">
              Menu
            </h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="text-white w-6 h-6" />
            </button>
          </div>

          {/* Sidebar content */}
          <Userheader />
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Userhome;
