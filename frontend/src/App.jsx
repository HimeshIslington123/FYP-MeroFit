import React from 'react';
import Home from './GymWebistePages/Home';
import AboutUs from './GymWebistePages/AboutUs';
import Whatweoffer from './GymWebistePages/Whatweoffer';
import Login from './GymWebistePages/Login';
import Whytochooseus from './GymWebistePages/Whytochooseus';
import Blog from './GymWebistePages/Blog';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contactus from './Components/Contactus';
import ComparePhoto from './UserDashboard/ComparePhoto';


const App = () => {
  return (
        <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/Whatweoffer/:id" element={<Whatweoffer />} />
         <Route path="/Contactus" element={<Contactus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/whytochooseus" element={<Whytochooseus />} />
        <Route path="/Blog" element={<Blog />} />
          <Route path="/compare" element={<ComparePhoto />} />

         </Routes>
    </Router>
  );
};

export default App;