import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../GlobalContext/Userprovider";
import {
  User,
  Crosshair,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Activity,
  Target,
  TrendingUp,
  CircleX
} from "lucide-react";
import axios from "axios";

const Profile = () => {

  const{user,setUser}=useContext(UserContext);
  const [userdata, setUserdata] = useState({});
  const [img, setImage] = useState("");

  

  // Form data state
  const [formdata, setFormdata] = useState({
    height: "",
    weight: "",
    target_weight: "",
    address: "",
    exercise_frequency: "",
    goal: "",
    activity_level: ""
  });


  const token = localStorage.getItem("token");

const update=async()=>{await axios.put(
  `http://localhost:4000/api/users/updateProfile/${user._id}`,
  formdata,
  { headers: { Authorization: `Bearer ${token}` } }
);
}

  // Fetch user on load
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/api/users/userdetail",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const u = res.data.data;

     
        setUserdata(u);
       setImage(res.data.img);
        // Fill form with existing user data
        setFormdata({
          height: u.height || "",
          weight: u.weight || "",
          target_weight: u.targetWeight || "",
          address: u.address || "",
          exercise_frequency: u.frequency || "",
          goal: u.goal || "",
          activity_level: u.activityLevel || ""
        });

      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, []);


   const[showedit,setshowedit]=useState(false);
  // Handle form input change
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  return (
    <>
      <div className="px-[0px] w-full  overflow-hidden lg:px-[50px] ">
        

     {showedit?<>
      
        <form className="w-full mt-5 p-6 rounded-2xl bg-[#0f0f0f] text-white space-y-5 shadow-xl">

<div className="flex justify-between items-center">
    <h1 className="text-2xl font-semibold mb-3">Update Details</h1>
    <CircleX className="text-red-600 hover:text-red-600/80 cursor-pointer" onClick={()=>setshowedit(false)} size={30}/>
</div>


  {/* Height */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Height (cm)</label>
    <input
      name="height"
      value={formdata.height}
      onChange={onChange}
      className="p-3 rounded-lg bg-transparent border border-white/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      placeholder="Enter height"
    />
  </div>

  {/* Weight */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Weight (kg)</label>
    <input
      name="weight"
      value={formdata.weight}
      onChange={onChange}
      className="p-3 rounded-lg bg-transparent border border-white/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      placeholder="Enter weight"
    />
  </div>

  {/* Target Weight */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Target Weight (kg)</label>
    <input
      name="target_weight"
      value={formdata.target_weight}
      onChange={onChange}
      className="p-3 rounded-lg bg-transparent border border-white/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      placeholder="Enter target weight"
    />
  </div>

  {/* Address */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Address</label>
    <input
      name="address"
      value={formdata.address}
      onChange={onChange}
      className="p-3 rounded-lg bg-transparent border border-white/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      placeholder="Enter address"
    />
  </div>

  {/* Exercise Frequency */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Exercise Frequency</label>
    <select
      name="exercise_frequency"
      value={formdata.exercise_frequency}
      onChange={onChange}
      className="p-3 rounded-lg bg-[#1a1a1a] border border-white/30 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">Select frequency</option>
      <option value="3 days">3 Days a Week</option>
      <option value="5 days">5 Days a Week</option>
      <option value="Everyday">Everyday</option>
    </select>
  </div>

  {/* Goal */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Goal</label>
    <select
      name="goal"
      value={formdata.goal}
      onChange={onChange}
      className="p-3 rounded-lg bg-[#1a1a1a] border border-white/30 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">Select goal</option>
      <option value="lose fat">Lose Fat</option>
      <option value="gain muscle">Gain Muscle</option>
      <option value="stay fit">Stay Fit</option>
    </select>
  </div>

  {/* Activity Level */}
  <div className="flex flex-col">
    <label className="text-sm opacity-70 mb-1">Activity Level</label>
    <select
      name="activity_level"
      value={formdata.activity_level}
      onChange={onChange}
      className="p-3 rounded-lg bg-[#1a1a1a] border border-white/30 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">Select level</option>
      <option value="very less">Very less active</option>
      <option value="moderate">Moderately active</option>
      <option value="active">Active</option>
      <option value="very active">Very active</option>
    </select>
  </div>
<button onClick={update} className="bg-[rgb(187,239,16)] w-full py-[10px] text-black  text-[20px] font-normal rounded-xl" type="submit">Update</button>
</form>


     </>:<>
     {/* Profile Card */}
        <div className="bg-black overflow-hidden   text-white p-[20px] rounded-[20px] w-full h-[40vh] flex flex-col items-center shadow-lg">
          
          {/* Profile Image */}
          <div className="rounded-full overflow-hidden">
            <img
              className="w-[150px] h-[150px] object-cover"
              src={img}
              alt="profile"
            />
          </div>

          {/* Name */}
          <div className="text-white mt-3 mb-0 flex flex-col items-center">
            <h1 className="text-[30px] m-[0] font-light">{userdata.name}</h1>
          </div>

          {/* Info Row */}
          <div className="flex text-white opacity-90 justify-center gap-[15px] text-[15px] flex-wrap mt-2">
            <div className="flex items-center gap-[5px]">
              <Mail size={18} /> 
              <span>{userdata.email}</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <MapPin size={18} /> <span>{userdata.address}</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <Calendar size={18} />{" "}
              <span>
                Joined{" "}
                {userdata.createdAt &&
                  new Date(userdata.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button onClick={()=>setshowedit(true)} className="bg-white mt-[15px] px-[15px] duration-500 py-[7px] rounded-[40px] text-black flex border-0 items-center cursor-pointer gap-2 hover:bg-black hover:border hover:border-red-100 hover:text-white">
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>

        {/* Stats Section */}
        <div className="w-full mt-[20px] flex overflow-hidden flex-wrap justify-between gap-[10px]">
          
          {/* Weight */}
          <div className="w-[45%] lg:w-[20%] flex flex-col items-center justify-between text-white rounded-[20px] p-[20px] bg-black shadow-md">
            <div className="bg-[#C7F045]/20 rounded-[10px] p-[10px]">
              <Activity size={40} color="#C7F045" />
            </div>
            <h1 className="text-[25px] font-semibold mt-2">
              {userdata.weight} kg
            </h1>
            <h3 className="text-[14px] text-center opacity-70">Current Weight</h3>
          </div>

          {/* Height */}
          <div className="w-[45%] lg:w-[20%]  flex flex-col text-white justify-between items-center rounded-[20px] p-[20px] bg-black shadow-md">
            <div className="bg-[#4DA8FF]/20 rounded-[10px] p-[10px]">
              <TrendingUp size={40} color="#4DA8FF" />
            </div>

            <h1 className="text-[25px] font-semibold mt-2">{userdata.height} cm</h1>
            <h3 className="text-[14px] opacity-70">Height</h3>
          </div>

          {/* Goal */}
          <div className="w-[45%] lg:w-[20%]  text-white  justify-between items-center bg-black flex flex-col  rounded-[20px] p-[20px] shadow-md">
            <div className="bg-[#9333EA]/20  rounded-[10px] p-[10px]">
              <Target size={40} color="#9333EA" />
            </div>
            <h1 className="text-[23px] text-center font-semibold mt-2">{userdata.goal}</h1>
            <h3 className="text-[14px] opacity-70">Fitness goal</h3>
          </div>

          {/* Target Weight */}
          <div className="w-[45%] lg:w-[20%]  text-white bg-black flex flex-col justify-between items-center rounded-[20px] p-[20px] shadow-md">
            <div className="bg-[#FF3131]/20 rounded-[10px] p-[10px]">
              <Crosshair size={40} color="#FF3131" />
            </div>
            <h1 className="text-[23px] font-semibold mt-2">
              {userdata.targetWeight} Kg
            </h1>
            <h3 className="text-[14px] text-center opacity-70">Target weight</h3>
          </div>
        </div>

        {/* Personal Info */}
        <div className="w-full p-[20px] rounded-[20px] bg-black text-white mt-3">
          <h1 className="opacity-55 mb-[10px]"> Personal Information</h1>

          <div className="w-full flex text-[14px] flex-col gap-[20px]">
            <div className="flex w-full pb-[10px] border-b-1 border-white/15 justify-between">
              <div className="opacity-55">Age</div>
              <div>{userdata.age} years</div>
            </div>

            <div className="flex w-full pb-[10px] border-b-1 border-white/15 justify-between">
              <div className="opacity-55">Gender</div>
              <div>{userdata.gender}</div>
            </div>

            <div className="flex w-full pb-[10px] border-b-1 border-white/15 justify-between">
              <div className="opacity-55">Activity Level</div>
              <div>{userdata.activityLevel}</div>
            </div>

            <div className="flex w-full pb-[10px] border-b-1 border-white/15 justify-between">
              <div className="opacity-55">Primary Goal</div>
              <div>{userdata.goal}</div>
            </div>

            <div className="flex w-full pb-[10px] border-b-1 border-white/15 justify-between">
              <div className="opacity-55">Weekly Workout Frequency</div>
              <div>{userdata.frequency} days/week</div>
            </div>
          </div>
        </div>

       
     </>}
        
      </div>
      
     {console.log("user info:", user)}

    </>
  );
};

export default Profile;
