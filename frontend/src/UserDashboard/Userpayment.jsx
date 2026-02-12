import React, { useState } from "react";
import Payment from "../payment/Payment";
import esewa from "../assets/esewa_logo.png";
const UserPayment = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
  { label: "1 Month", amount: 4500, duration: 1 },
  { label: "3 Months", amount: 12500, duration: 3 },
  { label: "6 Months", amount: 20500, duration: 6 },
  { label: "12 Months", amount: 30500, duration: 12 },
];


  return (
    <div className="bg-black min-h-screen w-full text-white flex flex-col items-center p-5 lg:p-10">
      <h1 className="text-3xl lg:text-4xl font-light mb-6">
        Our GYM Packages
      </h1>

      <div className="flex flex-wrap justify-between gap-6 w-full max-w-6xl">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-6 w-[85%] sm:w-[45%] lg:w-[30%] bg-opacity-100 backdrop-blur-md hover:bg-white/10 transition-all"
          >
            <h3 className="text-2xl font-light mb-1">{pkg.label}</h3>
            <p className="text-[15px] text-gray-300">Membership</p>

            <div className="w-full h-[1px] bg-gray-300 my-3" />

            <p className="text-xl font-light">Rs: {pkg.amount}/-</p>

            <button
              className="bg-[#D8FF00] transition-all px-5 py-2 mt-4 rounded-lg text-black font-light"
              onClick={() =>{  localStorage.setItem("duration", pkg.duration);
                 setSelectedPackage({ amount: pkg.amount, label: pkg.label,duration:pkg.duration })
              }
               
              }
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>

      {/* Show Payment Form */}
      <div className="w-full mt-10">
        {selectedPackage && (
          <Payment
            key={selectedPackage.amount}
            amount={selectedPackage.amount}
            label={selectedPackage.label}
            duration={selectedPackage.duration}
          />
        )}
      </div>
    </div>
  );
};

export default UserPayment;
