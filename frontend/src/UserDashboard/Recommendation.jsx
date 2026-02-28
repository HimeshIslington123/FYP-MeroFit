import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const RecommendationPreview = ({ limit }) => {
  const [data, setData] = useState(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */
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

  const foodsToShow = limit
    ? data.recommendedFoods.slice(0, limit)
    : data.recommendedFoods;

  const eatenProtein = data.targetProtein - data.remainingProtein;
  const eatenCarb = data.targetCarb - data.remainingCarb;
  const eatenFat = data.targetFat - data.remainingFat;

  const calcPercent = (value, target) =>
    Math.min(100, (value / target) * 100);

  /* ================= ADD FOOD ================= */
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

      fetchData(); // refresh dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-gray-50 ">
      {limit ? (
        /* ================= HOME PREVIEW ================= */
        <div className="space-y-4 w-[400px] p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2bb3a3]/10 rounded-xl flex items-center justify-center">
                🥗
              </div>
              <p className="font-semibold text-slate-800">
                Food Recommendation
              </p>
            </div>

            <button
              onClick={() => navigate("/userhome/recommendation")}
              className="flex items-center gap-1 text-sm font-semibold text-[#2bb3a3] hover:gap-2 transition-all"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {foodsToShow.length === 0 ? (
            <p className="text-slate-400 italic text-center py-4">
              No recommendationsh yet.
            </p>
          ) : (
            <div className="space-y-4">
              {foodsToShow.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {f.name}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {f.calories} kcal
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= FULL DASHBOARD ================= */
        <div className="max-w-6xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-center text-slate-800">
            Your Daily Nutrition Dashboard
          </h1>

          {/* SUMMARY CARDS */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* TARGET */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-700">
                 Daily Targets
              </h2>
              <p>Calories: <strong>{data.targetCalories} kcal</strong></p>
              <p>Protein: <strong>{data.targetProtein} g</strong></p>
              <p>Carbs: <strong>{data.targetCarb} g</strong></p>
              <p>Fat: <strong>{data.targetFat} g</strong></p>
            </div>

            {/* CONSUMED */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-700">
                Consumed Today
              </h2>

              {/* Calories */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories</span>
                  <span>{data.todayCalories} / {data.targetCalories}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2bb3a3]"
                    style={{
                      width: `${calcPercent(data.todayCalories, data.targetCalories)}%`
                    }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{eatenProtein.toFixed(1)} / {data.targetProtein} g</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${calcPercent(eatenProtein, data.targetProtein)}%`
                    }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbs</span>
                  <span>{eatenCarb.toFixed(1)} / {data.targetCarb} g</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${calcPercent(eatenCarb, data.targetCarb)}%`
                    }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fat</span>
                  <span>{eatenFat.toFixed(1)} / {data.targetFat} g</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${calcPercent(eatenFat, data.targetFat)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDED FOODS */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              🥗 Recommended Foods
            </h2>

            {foodsToShow.length === 0 ? (
              <p className="text-red-400">
                No recommendations available.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {foodsToShow.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                      {f.name}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Calories: {f.calories} kcal</p>
                      <p>Protein: {f.protein} g</p>
                      <p> Carbs: {f.carb} g</p>
                      <p> Fat: {f.fat} g</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFood(f);
                        setShowAddFood(true);
                      }}
                      className="mt-5 w-full bg-[#2bb3a3] text-white py-2 rounded-xl hover:bg-[#249e90] transition"
                    >
                      Add to Meal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ADD FOOD MODAL ================= */}
      {showAddFood && selectedFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl space-y-5">

            <h3 className="text-xl font-bold text-slate-800">
              Add {selectedFood.name}
            </h3>

            <p className="text-sm text-slate-500">
              Enter quantity in grams
            </p>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 text-center text-lg"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddFood(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={AddFood}
                className="flex-1 py-2 rounded-xl bg-[#2bb3a3] text-white hover:bg-[#249e90]"
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