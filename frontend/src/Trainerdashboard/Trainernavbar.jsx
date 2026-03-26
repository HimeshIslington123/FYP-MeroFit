import React from "react";
import {
  User,
  LayoutDashboard,
  Users,
  MessageCircle,
  FileText,
  Activity,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const TrainerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/userhome/logout");
  };

  const navItems = [
   
    {
      path: "/userlist",
      label: "My Users",
      icon: <Users size={18} />,
    },
    {
      path: "/trainerchat",
      label: "Chat",
      icon: <MessageCircle size={18} />,
    },

  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-slate-800 font-black text-xl leading-none tracking-tight">
            MeroFit
          </span>
          <span className="text-[#2bb3a3] text-[10px] font-black uppercase tracking-[0.2em]">
            Trainer Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex items-center bg-gray-50/50 p-1.5 rounded-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold tracking-tight ${
                isActive
                  ? "bg-white text-[#2bb3a3] shadow-sm ring-1 ring-black/5"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right Side */}
      <div onClick={handleLogout} className="flex items-center space-x-3">
        <div className="w-[1px] h-6 bg-gray-100 mx-2"></div>

        <button className="flex items-center gap-3 pl-2 pr-2 py-1 rounded-full hover:bg-gray-50 transition-all group">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-[#2bb3a3]/30 transition-all">
            <User className="text-slate-400" size={20} />
          </div>
          <p className="text-gray-500 font-semibold">Logout</p>
        </button>
      </div>
    </nav>
  );
};

export default TrainerNavbar;