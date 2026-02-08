import React from "react";
import badge1 from "../assets/badge1.png";
import badg2 from "../assets/badg2.png";
import badge3 from "../assets/badge3.png";
import badge4 from "../assets/badge4.png";
import badge5 from "../assets/badge5.png";
import badge6 from "../assets/badge6.png";
import badge7 from "../assets/badge7.png";
import badge8 from "../assets/badge8.png";
import badge9 from "../assets/badge9.png";
import { Award } from "lucide-react";

const badges = [
  { id: 1, image: badge1, title: "First Workout" },
  { id: 2, image: badg2, title: "1 Month Consistency" },
  { id: 3, image: badge3, title: "3 Months Strong" },
  { id: 4, image: badge4, title: "6 Months Beast Mode" },
  { id: 5, image: badge5, title: "1 Year Transformation" },
  { id: 6, image: badge6, title: "Weight Loss Achieved" },
  { id: 7, image: badge7, title: "Weight Gain Achieved" },
  { id: 8, image: badge8, title: "First Progress Post" },
  { id: 9, image: badge9, title: "Personal Record Broken" },
];

const Badge = ({ limit }) => {
  const visibleBadges = limit ? badges.slice(0, limit) : badges;

  return (<>
  {limit?<></>:<div className="flex items-center gap-2">
          <Award size={18} className="text-[#C7F045]" />
          <h1 className="text-white/90 text-lg font-medium tracking-wide">
            My Badges
          </h1>
        </div>}

  
    <div className="w-full flex flex-wrap gap-6 justify-between">
      {visibleBadges.map((badge) => (
        <div
          key={badge.id}
          className="
          mt-[40px]
            w-[300px] rounded-2xl p-6
            flex flex-col items-center
            bg-[#1A1A1A]
            border border-[rgba(199,240,69,0.25)]
            
            hover:shadow-[0_0_40px_rgba(199,240,69,0.35)]
            hover:scale-105
            transition-all duration-300
            cursor-pointer
            group
          "
        >
          <img
            src={badge.image}
            alt={badge.title}
            className="
              w-24 h-24 object-contain
              drop-shadow-[0_0_10px_rgba(199,240,69,0.45)]
              group-hover:drop-shadow-[0_0_18px_rgba(199,240,69,0.7)]
              transition
            "
          />

          <h3 className="mt-4 text-center text-white/90 font-medium tracking-wide">
            {badge.title}
          </h3>
        </div>
      ))}
    </div>
  </>);
};

export default Badge;
