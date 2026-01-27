// FULL CODE BELOW (START)

import {
  Plus,
  Dumbbell,
  Wheat,
  Droplet,
  CirclePlus,
  CircleX,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../GlobalContext/Userprovider";

const Calories = () => {
  const { user } = useContext(UserContext);
  const [foods, setFoods] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [displayFood, setDisplayFood] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const [selectedFood, setSelectedFood] = useState(null);
  const [allcaloiresdata, setAlldata] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyActivelog, setDailyActiveLog] = useState(null);

  const [foodData, setFoodData] = useState({
    name: "",
    protein: "",
    carb: "",
    fat: "",
  });

  const calcValue = (value) => {
    if (!value || !quantity) return 0;
    return Math.round((value / 100) * quantity);
  };

  const calculateProgress = () => {
    if (!user?.calories || d!todayLog?.log?.totalCalories) return 0;
    return (todayLog.log.totalCalories / user.calories) * 100;
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/calories", foodData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Food added successfully!");
      setFoodData({ name: "", protein: "", carb: "", fat: "" });
      fetchFoods();
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  const fetchTodayLog = async () => {
    try {
      const res = await axios.get("http://localhost:4000/TrackCalories/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayLog(res.data);
    } catch (err) {
      console.error("Error fetching today's log:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchTodayLog();
  }, [token]);

  const alldata = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/TrackCalories/all7days",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlldata(res.data);
    } catch (err) {
      console.error("Error fetching today's log:", err);
    }
  };

  useEffect(() => {
    alldata();
  }, [token]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const AddFood = async (foodId, quantity) => {
    try {
      const multiplier = quantity / 100;

      await axios.post(
        "http://localhost:4000/TrackCalories/add-food",
        { foodId, quantity: multiplier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodayLog();
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  return (
    <>
      {/* ========== SEARCH + FOOD DETAIL MODAL ========== */}
      {show && !showHistory && (
        <div className="w-full">
          {!displayFood && (
            <>
              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded bg-black text-white w-[95%] mt-4"
              />

              <div className="w-[95%] mt-4 flex flex-col gap-2 text-white">
                {search.trim() !== "" &&
                  (filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedFood(food);
                          setDisplayFood(true);
                        }}
                        className="bg-black p-2 rounded flex justify-between cursor-pointer"
                      >
                        <span>{food.name}</span>

                        <div className="flex gap-[10px]">
                          P: {food.protein}g | C: {food.carb}g | F: {food.fat}g
                          | Cal:
                          {food.calories}/100g
                          <CirclePlus
                            onClick={(e) => {
                              e.stopPropagation();
                              AddFood(food._id, 1);
                            }}
                            className="text-blue-500"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40">No foods found...</p>
                  ))}
              </div>
            </>
          )}

          {displayFood && selectedFood && (
            <div className="bg-black p-4 rounded text-white mt-4 w-[95%]">
              <h2 className="text-xl font-bold">{selectedFood.name}</h2>

              <p className="mt-2">
                <b>For {quantity} grams:</b>
                <br />
                Protein: {calcValue(selectedFood.protein)}g
                <br />
                Carbs: {calcValue(selectedFood.carb)}g
                <br />
                Fat: {calcValue(selectedFood.fat)}g
                <br />
                Calories: {calcValue(selectedFood.calories)} kcal
              </p>

              <div className="mt-4">
                <label>Quantity (grams):</label>
                <input
                  type="number"
                  className="p-2 rounded bg-white/10 text-white w-full mt-1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <button
                onClick={() => AddFood(selectedFood._id, quantity)}
                className="mt-4 w-full bg-blue-500 p-2 rounded"
              >
                Add Food
              </button>

              <button
                onClick={() => setDisplayFood(false)}
                className="mt-2 w-full bg-red-500 p-2 rounded"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {showHistory ? (
        <div className="w-full flex flex-col items-center text-white mt-5">
          {dailyActivelog ? (
            <></>
          ) : (
            <>
              <div className="flex justify-between items-center w-[95%]">
                <p className="text-[20px] font-semibold">Calories history</p>
                <p
                  className="text-red-600 cursor-pointer"
                  onClick={() => setShowHistory(false)}
                >
                  <CircleX />
                </p>
              </div>
            </>
          )}

          {dailyActivelog ? (
            <>
              <div className=" text-white w-[95%]">
                <div className="">
<div className="flex my-[10px] justify-between items-center">
                    <p>Food logs:</p>
                    <p
                      className="text-red-700"
                      onClick={() => setDailyActiveLog(null)}
                    >
                      <CircleX />
                    </p>
                  </div>


                  <div className="flex justify-between items-center">
                    <p>The food log for {dailyActivelog.date}</p>
                    <p>Total Calories: {dailyActivelog.totalCalories}/kcal</p>
                  </div>

                  

                  {dailyActivelog?.foods.map((i, index) => (
                    <div className="bg-black p-[15px] mt-[10px]" key={index}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-[10px]">
                          <p>{index + 1}.</p>
                          <p>{i.foodId.name}</p>
                        </div>

                        <p>{Math.round(i.calories)}/kcal</p>
                      </div>
                      <div>
                        <p>Protein: {i.foodId.protein} g</p>
                        <p>Carbs: {i.foodId.carb} g</p>
                        <p>Fats: {i.foodId.fat} g</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {allcaloiresdata?.log?.map((data, i) => (
                <div
                  onClick={() => setDailyActiveLog(data)}
                  key={i}
                  className="bg-black w-[95%] cursor-pointer  p-[15px] flex justify-between mt-3"
                >
                  <p>Date: {data.date}</p>

                  <div className="flex gap-[10px]">
                    <p>Total calories: {Math.round(data.totalCalories)} kcal</p>
                    <p>Protein: {Math.round(data.totalProtein)} g</p>
                    <p>Fat: {Math.round(data.totalFat)} g</p>
                    <p>Carbs: {Math.round(data.totalCarb)} g</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <>
          {/* ===================================================== */}
          {/* ========== NORMAL UI (NOT SHOW HISTORY) ============= */}
          {/* ===================================================== */}

          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-white py-5 px-5">
              <div className="flex flex-col">
                <h1 className="text-[20px] font-semibold">Track Calories</h1>
                <h1 className="text-white/50 text-[14px]">
                  Monitor your daily nutritional intake
                </h1>
              </div>
              <button
                onClick={() => setShow(true)}
                className="flex gap-2 items-center bg-sky-300 text-black rounded-xl px-4 py-2"
              >
                <Plus size={18} />
                Add food
              </button>
            </div>

            <div className="w-[95%] bg-[#111] rounded-[20px] px-4 py-4 text-white">
              <div className="flex justify-between text-[18px] pb-1">
                <span>Daily Progress</span>
                <span className="font-semibold">
                  {todayLog?.log?.totalCalories || 0} kcal
                </span>
              </div>
              <div className="flex justify-between text-white/60 text-[14px]">
                <span>Track your calorie intake</span>
                <span>of {user?.calories} kcal</span>
              </div>
              <div className="w-full h-[6px] mt-[10px] rounded-[10px] overflow-hidden bg-gray-300">
                <div
                  style={{ width: `${calculateProgress()}%` }}
                  className="h-[6px] rounded-[10px] bg-[#D8FF00]"
                ></div>
              </div>

              <div className="flex text-red-700 font-bold justify-end m-[5px]">
                {todayLog?.log?.totalCalories > user?.calories && (
                  <h1>
                    {todayLog.log.totalCalories - user.calories} kcal exceed
                  </h1>
                )}
              </div>
            </div>

            {todayLog && (
              <div className="w-[95%] flex justify-between mt-[20px] gap-3">
                <div className="w-[30%] bg-black flex flex-col items-center justify-center rounded-[20px] py-[30px] shadow-[0_0_5px_#D8FF00] text-white">
                  <div className="w-[60px] h-[60px] bg-[#4DA8FF]/20 rounded-[10px] flex items-center justify-center">
                    <Dumbbell size={32} className="text-[#4DA8FF]" />
                  </div>
                  <p className="text-[25px] mt-2">
                    {todayLog.log.totalProtein}g
                  </p>
                  <p className="text-[20px]">Protein</p>
                </div>

                <div className="w-[30%] bg-black flex flex-col items-center justify-center rounded-[20px] py-[30px] shadow-[0_0_5px_#D8FF00] text-white">
                  <div className="w-[60px] h-[60px] bg-[#FFD966]/20 rounded-[10px] flex items-center justify-center">
                    <Wheat size={32} className="text-[#FFD966]" />
                  </div>
                  <p className="text-[25px] mt-2">{todayLog.log.totalCarb}g</p>
                  <p className="text-[20px]">Carbs</p>
                </div>

                <div className="w-[30%] bg-black flex flex-col items-center justify-center rounded-[20px] py-[30px] shadow-[0_0_5px_#D8FF00] text-white">
                  <div className="w-[60px] h-[60px] bg-[#FF8A8A]/20 rounded-[10px] flex items-center justify-center">
                    <Droplet size={32} className="text-[#FF8A8A]" />
                  </div>
                  <p className="text-[25px] mt-2">{todayLog.log.totalFat}g</p>
                  <p className="text-[20px]">Fats</p>
                </div>
              </div>
            )}

            <div className="w-[95%] flex justify-between mt-[25px] items-center text-white">
              <p className="text-[18px] font-semibold">Today's Meals</p>
              <p
                className="cursor-pointer"
                onClick={() => setShowHistory(true)}
              >
                View history
              </p>
            </div>

            {todayLog?.log?.foods?.length > 0 ? (
              todayLog.log.foods.map((entry, idx) => (
                <div key={idx} className="w-[95%] bg-black rounded-xl p-4 mt-3">
                  <div className="flex justify-between text-[16px] font-semibold text-[#D8FF00]">
                    <span>{entry.foodId?.name}</span>
                    <span>{entry.calories} kcal</span>
                  </div>

                  <ul className="list-disc ml-5 mt-2 text-white/80 text-[16px]">
                    <li>Quantity: {entry.quantity * 100}g</li>
                  </ul>

                  <div className="flex flex-wrap gap-4 mt-3 text-white/60 text-[14px]">
                    <p>
                      Protein:{" "}
                      <span className="text-white font-semibold">
                        {entry.protein}g
                      </span>
                    </p>
                    <p>
                      Carbs:{" "}
                      <span className="text-white font-semibold">
                        {entry.carb}g
                      </span>
                    </p>
                    <p>
                      Fat:{" "}
                      <span className="text-white font-semibold">
                        {entry.fat}g
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40">No foods logged today</p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex hidden flex-col gap-2 mt-5 w-[95%]"
            >
              <input
                name="name"
                placeholder="Name of food"
                value={foodData.name}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white"
              />
              <input
                name="protein"
                type="number"
                placeholder="Protein per 100g"
                value={foodData.protein}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white"
              />
              <input
                name="carb"
                type="number"
                placeholder="Carbs per 100g"
                value={foodData.carb}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white"
              />
              <input
                name="fat"
                type="number"
                placeholder="Fat per 100g"
                value={foodData.fat}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white"
              />
              <button
                type="submit"
                className="bg-sky-300 text-black rounded-xl px-4 py-2 mt-2"
              >
                Add Food
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Calories;

// FULL CODE ABOVE (END)
