import React from "react";
import { User, Bell } from "lucide-react";
import { NavLink } from "react-router-dom"; // ✅ Import NavLink

const Navbar = () => {
  return (
    <nav className="bg-[#1A1A1A] p-4 flex justify-between items-center shadow-[0_0_20px_rgba(199,240,69,0.15)]">
      {/* Logo / Title */}
      <div className="text-[#C7F045] font-light text-xl tracking-wide">
        MeroFit
      </div>

      {/* Nav Links */}
      <div className="flex items-center space-x-6">
        <NavLink
          to="/adminhome"
          className={({ isActive }) =>
            `font-light transition-colors ${
              isActive ? "text-[#C7F045]" : "text-white/80 hover:text-[#C7F045]"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/adminblog"
          className={({ isActive }) =>
            `font-light transition-colors ${
              isActive ? "text-[#C7F045]" : "text-white/80 hover:text-[#C7F045]"
            }`
          }
        >
          Blog
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `font-light transition-colors ${
              isActive ? "text-[#C7F045]" : "text-white/80 hover:text-[#C7F045]"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `font-light transition-colors ${
              isActive ? "text-[#C7F045]" : "text-white/80 hover:text-[#C7F045]"
            }`
          }
        >
          Settings
        </NavLink>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Bell className="text-white/80 hover:text-[#C7F045] transition-colors cursor-pointer" />
          <User className="text-white/80 hover:text-[#C7F045] transition-colors cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
