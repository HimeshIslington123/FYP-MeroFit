import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const RecommendationPreview = ({ limit }) => {
  const [data, setData] = useState(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const [activeTab, setActiveTab] = useState("ALL");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/recommendation",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <h2 className="text-center mt-20 text-slate-400 text-lg">
        Loading recommendations...
      </h2>
    );
  }

  const eatenProtein = data.targetProtein - data.remainingProtein;
  const eatenCarb = data.targetCarb - data.remainingCarb;
  const eatenFat = data.targetFat - data.remainingFat;

  const calcPercent = (value, target) =>
    Math.min(100, (value / target) * 100);


  const filteredFoods =
    activeTab === "ALL"
      ? data.recommendedFoods
      : data.recommendedFoods.filter(
          (f) => f.mealType === activeTab
        );

  const foodsToShow = limit
    ? filteredFoods.slice(0, limit)
    : filteredFoods;

  const AddFood = async () => {
    try {
      const multiplier = quantity / 100;

      await axios.post(
        "http://localhost:4000/TrackCalories/add-food",
        {
          foodId: selectedFood._id,
          quantity: multiplier,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddFood(false);
      setSelectedFood(null);
      setQuantity(100);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-gray-50">


      {limit ? (
        <div className="space-y-4 w-[400px] p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <p className="font-semibold">Food Recommendation</p>

            <button
              onClick={() => navigate("/userhome/recommendation")}
              className="text-sm text-[#2bb3a3]"
            >
              View All →
            </button>
          </div>

          {foodsToShow.map((f) => (
            <div
              key={f._id}
              className="flex justify-between p-3 border rounded-xl"
            >
              <div>
                <p className="font-semibold">{f.name}</p>
                <p className="text-sm text-gray-400">
                  {f.calories} kcal
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
      
        <div className="max-w-6xl mx-auto space-y-10">

          <h1 className="text-3xl font-bold text-center">
            Your Daily Nutrition Dashboard
          </h1>

         
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-2">Daily Targets</h2>
              <p>Calories: {data.targetCalories}</p>
              <p>Protein: {data.targetProtein}</p>
              <p>Carbs: {data.targetCarb}</p>
              <p>Fat: {data.targetFat}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border space-y-4">
              <h2 className="font-semibold">Consumed</h2>

              {/* Calories */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span>{data.todayCalories}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-green-500"
                    style={{
                      width: `${calcPercent(
                        data.todayCalories,
                        data.targetCalories
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span>{eatenProtein}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-500"
                    style={{
                      width: `${calcPercent(
                        eatenProtein,
                        data.targetProtein
                      )}%`,
                    }}
                  />
                </div>
              </div>


              <div>
                <div className="flex justify-between text-sm">
                  <span>Carbs</span>
                  <span>{eatenCarb}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-yellow-500"
                    style={{
                      width: `${calcPercent(
                        eatenCarb,
                        data.targetCarb
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <span>{eatenFat}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-red-500"
                    style={{
                      width: `${calcPercent(
                        eatenFat,
                        data.targetFat
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
{data.message && (
    <div className="bg-blue-50 border border-blue-200 text-black p-3 rounded-lg text-center font-medium">
      {data.message}
    </div>
  )}

          <div className="flex gap-3 flex-wrap">
            {[
              "ALL",
              "BREAKFAST",
              "LUNCH",
              "DINNER",
              "SNACK",
              "POST_WORKOUT",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  activeTab === tab
                    ? "bg-[#2bb3a3] text-white"
                    : "bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {foodsToShow.map((f) => (
              <div
                key={f._id}
                className="bg-white p-4 border rounded-xl"
              >
                <h3 className="font-bold">{f.name}</h3>
                <p className="text-sm text-gray-500">
                  {f.mealType}
                </p>
                <p>{f.calories} kcal</p>

                <button
                  onClick={() => {
                    setSelectedFood(f);
                    setShowAddFood(true);
                  }}
                  className="mt-3 w-full bg-[#2bb3a3] text-white py-2 rounded"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}




      {showAddFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[350px]">

            <h2 className="text-lg font-bold mb-3">
              Add {selectedFood?.name}
            </h2>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAddFood(false)}
                className="w-full border p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={AddFood}
                className="w-full bg-[#2bb3a3] text-white p-2 rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPreview;