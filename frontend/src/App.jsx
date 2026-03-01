import React from "react";
import Home from "./GymWebistePages/Home";
import AboutUs from "./GymWebistePages/AboutUs";
import Whatweoffer from "./GymWebistePages/Whatweoffer";
import Login from "./GymWebistePages/Login";
import Whytochooseus from "./GymWebistePages/Whytochooseus";
import Blog from "./GymWebistePages/Blog";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contactus from "./Components/Contactus";
import ComparePhoto from "./UserDashboard/ComparePhoto";
import Userhome from "./UserDashboard/UserHome";
import { UserContext } from "./GlobalContext/Userprovider";
import { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import UserPayment from "./UserDashboard/Userpayment";
import Homeuser from "./UserDashboard/Home";
import Profile from "./UserDashboard/Profile";
import Badge from "./Userdashboardcomponent/Badge";
import Calories from "./UserDashboard/Calories";
import Exercise from "./Userdashboardcomponent/Exercise";
import AdminHome from "./AdminDashboard/AdminHome";
import AdminBlog from "./AdminDashboard/AdminBlog";
import SingleBlog from "./GymWebistePages/SingleBlog";
import PaymentSuccess from "./payment/PaymentSuccess";
import ExercisePr from "./UserDashboard/ExercisePr";
import Logout from "./UserDashboard/Logout";
import WeightChanges from "./UserDashboard/WeightChanges";
import AdminUser from "./AdminDashboard/AdminUser";
import Food from "./Userdashboardcomponent/Food";
import Chat from "./UserDashboard/Chat";
import TrackChanges from "./UserDashboard/TrackChanges";
import Post from "./UserDashboard/Post";
import Trainer from "./Userdashboardcomponent/Trainer";
import AdminFoods from "./AdminDashboard/AdminFoods";
import Analysis from "./UserDashboard/Analysis";
import Recommendation from "./UserDashboard/Recommendation";
import ExerciseRecommendation from "./UserDashboard/Recommendexercise";
import RecommendationPreview from "./UserDashboard/Recommendation";
import Adminchat from "./AdminDashboard/Adminchat";
import AdminTrainer from "./AdminDashboard/AdminTrainer";
import AdminCommunity from "./AdminDashboard/AdminCommunity";

const App = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/api/users/userdetail",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const u = res.data.data;

        setUser(u);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, []);

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
        <Route path="/blog/:id" element={<SingleBlog />} />

        <Route
          path="/paymentsuccess"
          element={<PaymentSuccess></PaymentSuccess>}
        />

        {/* Admin pages */}
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminblog" element={<AdminBlog />} />
        <Route path="/adminuser" element={<AdminUser />} />
        <Route path="/adminfood" element={<AdminFoods />} />
        <Route path="/adminchat" element={<Adminchat />} />
        <Route path="/admintrainer" element={<AdminTrainer />} />
                <Route path="/admincommunity" element={<AdminCommunity />} />

        <Route path="/userhome" element={<Userhome />}>
          <Route path="compare" element={<ComparePhoto />} />
          <Route path="userpayment" element={<UserPayment />} />
          <Route path="home" element={<Homeuser />} />
          <Route path="profile" element={<Profile />} />
          <Route path="badge" element={<Badge />} />
          <Route path="exercise" element={<Exercise />} />
          <Route path="trackcalories" element={<Calories />} />
          <Route path="exercisepr" element={<ExercisePr />} />
          <Route path="logout" element={<Logout />} />
          <Route path="weightchanges" element={<WeightChanges />} />
          <Route path="foods" element={<Food />} />
          <Route path="chat" element={<Chat />} />
          <Route
            path="recommendexercise"
            element={<ExerciseRecommendation />}
          />

          <Route path="chat/:trainerId" element={<Chat />} />
          <Route path="trackchanges" element={<TrackChanges />} />
          <Route path="post" element={<Post />} />
          <Route path="trainer" element={<Trainer />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="recommendation" element={<RecommendationPreview />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
