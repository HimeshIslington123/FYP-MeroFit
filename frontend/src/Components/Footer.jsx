import React from "react";
import gymlogo from "../assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-black text-amber-50 py-8 px-6 md:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden mb-3">
            <img
              className="h-full w-full object-cover"
              src={gymlogo}
              alt="Gym Logo"
            />
          </div>
          <p className="text-sm text-gray-400 text-center md:text-left">
            Stay fit. Stay strong. Join us today!
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-center md:text-left">
          <h1>About Us</h1>
          <h1>Programs</h1>
          <h1>Trainers</h1>
          <h1>Contact</h1>
          <h1>Membership</h1>
          <h1>Gallery</h1>
          <h1>FAQ</h1>
          <h1>Privacy Policy</h1>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PowerGym. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
