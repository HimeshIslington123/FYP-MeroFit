import React, { useContext } from "react";
import Trainer from "../Userdashboardcomponent/Trainer";
import { TrendingUp, Flame, Activity, Target, Award,ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserPayment from "./UserPayment";

import { useEffect } from "react";
import axios from "axios";
import { UserContext } from "../GlobalContext/Userprovider";
import Badge from "../Userdashboardcomponent/Badge";

const Homeuser = () => {
  const{user,setUser}=useContext(UserContext);
const[value,setValues]=useState(null)
   
  
 
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const verify = async () => {
      const res = await axios.get(`http://localhost:4000/esewa/getPayment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setValues(res.data);
    };

    verify();
  }, []);
   if (!user) {
    return <div className="text-white">Loading...</div>;
  }


  const stats = [
    {
      label: "Weight",
      value: user.weight,
      unit: "kg",
      icon: Activity,
      change: "-2.3%",
      isPositive: true,
    },
    {
      label: "Height",
      value: user.height,
      unit: "cm",
      icon: TrendingUp,
      change: "",
      isPositive: true,
    },
    {
      label: "Body Fat",
      value: "18.2",
      unit: "%",
      icon: Target,
      change: "-1.5%",
      isPositive: true,
    },
    {
      label: "Calories",
      value: user.calories,
      unit: "kcal",
      icon: Flame,
      change: "+12%",
      isPositive: true,
    },
    {
      label: "Progress",
      value: "78",
      unit: "%",
      icon: Award,
      change: "+8%",
      isPositive: true,
    },
  ];

  return (
    <div className="w-full text-white">
      {/* Header */}
      <h4 className="text-[25px] font-semibold text-gray-50">
        Hi, {user?.name},
        {console.log(user)}
      </h4>
      <h4 className="text-[15px] opacity-65 text-gray-50">
        Wednesday, 22 October, 2025
      </h4>

      {/* Stats Cards */}
      <div className="w-full flex flex-row flex-wrap mt-4 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5  gap-5 w-full">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#1A1A1A] border-0 p-6 rounded-2xl shadow-[0_0_30px_rgba(199,240,69,0.15)] hover:shadow-[0_0_40px_rgba(199,240,69,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#C7F045]/10 rounded-xl group-hover:bg-[#C7F045]/20 transition-colors">
                    <Icon size={24} className="text-[#C7F045]" />
                  </div>
                  {stat.change && (
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? "text-[#C7F045]" : "text-[#FF3131]"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-white text-3xl mb-1">
                  {stat.value}
                  <span className="text-gray-500 flex-wrap text-lg ml-1">
                    {stat.unit}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
     

     
     <div className="mt-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-[-30px]">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#C7F045]" />
          <h1 className="text-white/90 text-lg font-medium tracking-wide">
            My Badges
          </h1>
        </div>

        <Link
          to="/userhome/badge"
          className="
            flex items-center gap-1
            text-sm text-white/70
            hover:text-[#C7F045]
            transition
          "
        >
          View More
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Badges */}
      <Badge limit={3} />
    </div>
    </div>

  );
};

export default Homeuser;
