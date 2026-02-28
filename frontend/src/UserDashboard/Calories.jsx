import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, CirclePlus, CircleX } from "lucide-react";
import { UserContext } from "../GlobalContext/Userprovider";

const Calories = () => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
const [food, setFood] = useState({
  name: "",
  protein: 0,
  carb: 0,   // NOT carbs
  fat: 0,
  foodType: "BALANCED",
});
  const [foods, setFoods] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [allCaloriesData, setAllCaloriesData] = useState(null);

  const [showAddFood, setShowAddFood] = useState(false);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyActiveLog, setDailyActiveLog] = useState(null);

  /* ================= TARGET CALCULATIONS ================= */
  const targetCalories = user?.calories || 0;

  let proteinPercent = 0.3;
  let carbPercent = 0.4;
  let fatPercent = 0.3;

  if (user?.goal === "lose fat") {
    proteinPercent = 0.35;
    carbPercent = 0.35;
    fatPercent = 0.3;
  }

  if (user?.goal === "gain muscle") {
    proteinPercent = 0.3;
    carbPercent = 0.5;
    fatPercent = 0.2;
  }
const handleAddFood = async () => {
  try {
    const res = await axios.post(
      "http://localhost:4000/calories",
      food
    );

    console.log(res.data);
    alert("Food Added");

    setFood({
      name: "",
      protein: 0,
      carb: 0,
      fat: 0,
      foodType: "BALANCED",
    });

  } catch (error) {
    console.error(error);
    alert("Error adding food");
  }
};

const handleChange = (field, value) => {
  setFood((prev) => ({
    ...prev,
    [field]: field === "name" ? value : Number(value),
  }));
};
  const targetProtein = Math.round((targetCalories * proteinPercent) / 4);
  const targetCarb = Math.round((targetCalories * carbPercent) / 4);
  const targetFat = Math.round((targetCalories * fatPercent) / 9);

  const todayCalories = todayLog?.log?.totalCalories || 0;
  const todayProtein = todayLog?.log?.totalProtein || 0;
  const todayCarb = todayLog?.log?.totalCarb || 0;
  const todayFat = todayLog?.log?.totalFat || 0;

  /* ================= API CALLS ================= */
  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayLog = async () => {
    try {
      const res = await axios.get("http://localhost:4000/TrackCalories/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayLog(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/TrackCalories/all7days",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllCaloriesData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const AddFood = async (foodId, quantity) => {
    try {
      const multiplier = quantity / 100;
      await axios.post(
        "http://localhost:4000/TrackCalories/add-food",
        { foodId, quantity: multiplier },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTodayLog();
      setShowAddFood(false);
      setSelectedFood(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchFoods();
    fetchTodayLog();
    fetchAllData();
  }, [token]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  const progress = (current, target) =>
    target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className=" min-h-screen ">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl  text-gray-800">Calorie Tracking</h1>
          <p className="text-gray-500">Monitor your daily nutrition</p>
        </div>
        <button
          onClick={() => setShowAddFood(true)}
          className="bg-[#229e8f] text-[#e8f7f6] hover:bg-[#4d9388] px-4 py-2 rounded-4xl flex items-center gap-2 shadow"
        >
          <Plus size={18} /> Track meal
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Calories",
            value: todayCalories,
            target: targetCalories,
            unit: "kcal",
            color: "text-teal-500",
            bg: "bg-teal-500",
          },
          {
            title: "Protein",
            value: todayProtein,
            target: targetProtein,
            unit: "g",
            color: "text-orange-500",
            bg: "bg-orange-500",
          },
          {
            title: "Carbs",
            value: todayCarb,
            target: targetCarb,
            unit: "g",
            color: "text-purple-500",
            bg: "bg-purple-500",
          },
          {
            title: "Fat",
            value: todayFat,
            target: targetFat,
            unit: "g",
            color: "text-green-500",
            bg: "bg-green-500",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-600">{card.title}</h2>

            <p className={`text-3xl mt-2   ${card.color}`}>
              {card.value} {card.unit}
            </p>

            <p className="text-gray-500">
              of {card.target} {card.unit}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded mt-3">
              <div
                className={`${card.bg} h-2 rounded`}
                style={{ width: `${progress(card.value, card.target)}%` }}
              ></div>
            </div>

            {/* Exceeded Warning */}
            {card.title === "Calories" && todayCalories > targetCalories && (
              <p className="text-red-600 mt-2 font-bold">
                {todayCalories - targetCalories} kcal exceeded
              </p>
            )}
          </div>
        ))}
      </div>







 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center gap-1 mb-3">
        <Plus size={24} />
        <p className="text-2xl">Add Food Entry</p>
      </div>

      {/* Form Fields */}
      <div className="flex flex-wrap items-end gap-4">

        {/* Food Item Name */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-slate-500 font-medium mb-2 ml-1">
            Food Item
          </label>
          <input
            type="text"
            placeholder="e.g. Grilled Chicken"
            value={food.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-4 rounded-xl border h-[30px] border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5db0a3]/20 focus:border-[#5db0a3] transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Protein */}
        <div className="w-24">
          <label className="block text-slate-500 font-medium mb-2 ml-1">
            Protein (g)
          </label>
          <input
            type="number"
            value={food.protein}
            onChange={(e) => handleChange("protein", e.target.value)}
            className="w-full p-4 rounded-xl  h-[30px] border border-gray-200 text-center"
          />
        </div>

        {/* Carbs */}
        <div className="w-24">
          <label className="block text-slate-500 font-medium mb-2 ml-1">
            Carbs (g)
          </label>
          <input
            type="number"
            value={food.carb}
            onChange={(e) => handleChange("carb", e.target.value)}
            className="w-full p-4 rounded-xl  h-[30px] border border-gray-200 text-center"
          />
        </div>

        {/* Fat */}
        <div className="w-24">
          <label className="block text-slate-500 font-medium mb-2 ml-1">
            Fat (g)
          </label>
          <input
            type="number"
            value={food.fat}
            onChange={(e) => handleChange("fat", e.target.value)}
            className="w-full p-4 rounded-xl border  h-[30px] border-gray-200 text-center"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddFood}
          className="bg-[#229e8f] text-[#e8f7f6] hover:bg-[#4d9388] px-4 py-3 rounded-4xl flex items-center gap-2 shadow"
        >
          Add
        </button>

      </div>
    </div>

















      {/* ================= TODAY LOG TABLE ================= */}
      <h2 className="text-xl font-semibold  mt-5 mb-6">Today's Food Log</h2>
      <div className="bg-white  rounded-2xl shadow-lg mb-8">
        {todayLog?.log?.foods?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Food Item</th>
                  <th className="text-center py-3 px-4">Calories</th>
                  <th className="text-center py-3 px-4">Protein</th>
                  <th className="text-center py-3 px-4">Carbs</th>
                  <th className="text-center py-3 px-4">Fat</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {todayLog.log.foods.map((entry, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200  hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4 font-medium">
                      {entry.foodId?.name}
                    </td>
                    <td className="text-center text-[#229e8f] py-4 px-4">
                      {entry.calories} kcal
                    </td>
                    <td className="text-center py-4 px-4">{entry.protein} g</td>
                    <td className="text-center py-4 px-4">{entry.carb} g</td>
                    <td className="text-center py-4 px-4">{entry.fat} g</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className=" font-semibold text-gray-800 border-t-1">
                  <td className="py-4 px-4">Total</td>
                  <td className="text-center text-[#229e8f]  py-4 px-4">
                    {todayCalories} kcal
                  </td>
                  <td className="text-center py-4 px-4">{todayProtein} g</td>
                  <td className="text-center py-4 px-4">{todayCarb} g</td>
                  <td className="text-center py-4 px-4">{todayFat} g</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            No foods logged today
          </p>
        )}
      </div>

      {/* ================= HISTORY ================= */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">History</h2>
          <p
            className="text-red-600 cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? <CircleX /> : "View"}
          </p>
        </div>
        {showHistory && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {allCaloriesData?.log?.map((data, i) => (
              <div
                key={i}
                onClick={() => setDailyActiveLog(data)}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <p>Date: {data.date}</p>
                  <p>Total Calories: {Math.round(data.totalCalories)} kcal</p>
                </div>
                <div className="flex gap-4 mt-2 text-gray-500 text-sm">
                  <p>Protein: {Math.round(data.totalProtein)}g</p>
                  <p>Carbs: {Math.round(data.totalCarb)}g</p>
                  <p>Fat: {Math.round(data.totalFat)}g</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {dailyActiveLog && (
          <div className="bg-white p-4 rounded mt-4 shadow">
            <div className="flex justify-between mb-2">
              <p>Food log for {dailyActiveLog.date}</p>
              <CircleX
                className="cursor-pointer text-red-600"
                onClick={() => setDailyActiveLog(null)}
              />
            </div>
            {dailyActiveLog.foods.map((f, i) => (
              <div key={i} className="p-2 border-b last:border-b-0">
                <p className="font-semibold">{f.foodId.name}</p>
                <p>
                  Calories: {Math.round(f.calories)} kcal | Protein:{" "}
                  {f.foodId.protein}g | Carbs: {f.foodId.carb}g | Fat:{" "}
                  {f.foodId.fat}g
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ADD FOOD MODAL ================= */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Food Entry</h2>
              <X
                className="cursor-pointer"
                onClick={() => {
                  setShowAddFood(false);
                  setSelectedFood(null);
                }}
              />
            </div>

            {!selectedFood ? (
              <>
                <input
                  type="text"
                  placeholder="Search food..."
                  className="w-full p-2 border rounded mb-4"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedFood(food)}
                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                      >
                        {food.name} | P:{food.protein}g C:{food.carb}g F:
                        {food.fat}g
                        <CirclePlus
                          className="ml-2 text-green-500 inline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            AddFood(food._id, 100);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No foods found...</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{selectedFood.name}</h3>
                <p className="mt-2">
                  P: {selectedFood.protein}g | C: {selectedFood.carb}g | F:{" "}
                  {selectedFood.fat}g | Cal: {selectedFood.calories} kcal
                </p>
                <input
                  type="number"
                  className="w-full border p-2 rounded mt-3"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  onClick={() => AddFood(selectedFood._id, quantity)}
                  className="w-full bg-teal-500 text-white p-2 rounded mt-4"
                >
                  Add Food
                </button>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="w-full bg-red-500 text-white p-2 rounded mt-2"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calories;
