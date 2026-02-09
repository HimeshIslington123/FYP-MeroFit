import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import gym from "../assets/gymImage.jpg";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

const Login = () => {

  const nav=useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    exerciseType: "",
    frequency: "",
    goal: "",
    activityLevel: "",
    targetWeight: "",
    address: "",
    image: null,
  });

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));//to show preview
  };


  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/users/login", {
        email: formData.email,
        password: formData.password,
      });
     if (res.data.success) {
 
  localStorage.setItem("token", res.data.token);


  localStorage.setItem("userId", res.data.id);

  alert("Login successful");
 nav("/userhome/compare");

  
}

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed!");
    }
  };

  // ---------------- REGISTER ----------------
  const registerUser = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post(
        "http://localhost:4000/api/users/create",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Registered successfully!");
      console.log(res.data);
      setIsLogin(true);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  const handleSubmits = (e) => {
    e.preventDefault();
    registerUser();
  };

  // Step navigation
  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  return (
    <>
      <Header />
      <div
        className="w-full h-[90vh] flex justify-center items-center bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${gym})` }}
      >
        <form
          className="bg-white/30 h-[80%] backdrop-blur-xl border border-white/30 
            flex flex-col gap-6 p-10 rounded-2xl shadow-lg md:w-1/3 w-4/5"
        >
          {/* Step Indicators */}
          <div className="flex w-full justify-between md:px-[70px] px-[20px]">
            {!isLogin &&
              [1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-semibold 
                    ${
                      step === s
                        ? "bg-white text-black"
                        : "bg-amber-600 text-white"
                    }`}
                  onClick={() => setStep(s)}
                >
                  {s}
                </div>
              ))}
          </div>

          <h1 className="text-center text-2xl font-semibold text-white">
            {isLogin? "Login User"
              : step === 1
              ? "Basic Information"
              : step === 2
              ? "Body Details"
              : "Fitness Preferences"}
          </h1>

          {/* LOGIN FORM */}
          {isLogin && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
              />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
              />
              <button
                onClick={login}
                className="bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-500 transition duration-300"
              >
                Login
              </button>
            </>
          )}

          {/* REGISTER MULTI-STEP FORM */}
          {!isLogin && (
            <>
              {step === 1 && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-500 transition duration-300"
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Enter your height (cm)"
                    value={formData.height}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Enter your weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-500"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <select
                    name="exerciseType"
                    value={formData.exerciseType}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Select exercise type</option>
                    <option value="gym">Gym</option>
                    <option value="home">Home Workout</option>
                    <option value="yoga">Yoga</option>
                    <option value="cardio">Cardio</option>
                  </select>





                   <select
                    name="fitnesslevel"
                    value={formData.fitnesslevel}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Select fitnessLevel</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                   
                  </select>



                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Exercise frequency</option>
                    <option value="3 days">3 Days a Week</option>
                    <option value="5 days">5 Days a Week</option>
                    <option value="Everyday">Everyday</option>
                  </select>

                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Your goal</option>
                    <option value="lose fat">Lose Fat</option>
                    <option value="gain muscle">Gain Muscle</option>
                    <option value="stay fit">Stay Fit</option>
                  </select>

                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  >
                    <option value="">Activity level</option>
                    <option value="very less">Very less active</option>
                    <option value="moderate">Moderately active</option>
                    <option value="active">Active</option>
                    <option value="very active">Very active</option>
                  </select>

                  <input
                    type="number"
                    name="targetWeight"
                    placeholder="Target weight (kg)"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="p-3 rounded-md border border-white/50 bg-white/100 text-black"
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="rounded-md mt-2"
                      width="100"
                    />
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmits}
                      className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-500"
                    >
                      Register
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* TOGGLE LOGIN/REGISTER */}
          {isLogin ? (
            <h5 className="text-center text-black">
              Haven't registered?{" "}
              <span
                onClick={() => {
                  setIsLogin(false);
                  setStep(1);
                }}
                className="text-orange-400 cursor-pointer hover:underline"
              >
                Register now
              </span>
            </h5>
          ) : (
            <h5 className="text-center text-black">
              Already registered?{" "}
              <span
                onClick={() => {
                  setIsLogin(true);
                  setStep(1);
                }}
                className="text-orange-400 cursor-pointer hover:underline"
              >
                Login now
              </span>
            </h5>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
