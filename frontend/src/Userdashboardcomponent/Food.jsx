import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../GlobalContext/Userprovider";
import { Apple, Coffee, Pizza, Award } from "lucide-react"; // Icons

const Food = ({ limit = null, showFilters = true }) => {
  const { user } = useContext(UserContext);
  const [foods, setFoods] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("RECOMMENDED");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate recommended foods based on user goal
  useEffect(() => {
    if (!user || !foods.length) return;

    let recommended = [...foods];

    if (user.goal === "lose fat") {
      recommended = recommended.filter(
        (food) => food.foodType === "HIGH_PROTEIN" || food.foodType === "KETO"
      );
    } else if (user.goal === "gain muscle") {
      recommended = recommended.filter(
        (food) => food.foodType === "HIGH_PROTEIN" || food.foodType === "BALANCED"
      );
    } else if (user.goal === "stay fit") {
      recommended = recommended.filter(
        (food) => food.foodType === "BALANCED" || food.foodType === "LOW_FAT"
      );
    }

    setRecommendedFoods(recommended);
  }, [foods, user]);

  // Filter displayed foods based on search & type filter
  useEffect(() => {
    if (!foods.length) return;

    let filtered = [];

    if (foodTypeFilter === "RECOMMENDED") {
      filtered = [...recommendedFoods];
    } else if (foodTypeFilter) {
      filtered = foods.filter((food) => food.foodType === foodTypeFilter);
    } else {
      filtered = [...foods];
    }

    if (searchTerm) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply limit if provided
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setDisplayedFoods(filtered);
  }, [foodTypeFilter, searchTerm, foods, recommendedFoods, limit]);

  useEffect(() => {
    fetchFoods();
  }, []);

  if (!user)
    return <h2 className="text-white text-center mt-10">Loading user data...</h2>;
  if (loading)
    return <h2 className="text-white text-center mt-10">Loading foods...</h2>;

  // Map foodType to an icon
  const getIcon = (type) => {
    switch (type) {
      case "HIGH_PROTEIN":
        return <Apple size={18} className="text-[#C7F045]" />;
      case "KETO":
        return <Coffee size={18} className="text-[#C7F045]" />;
      case "BALANCED":
        return <Pizza size={18} className="text-[#C7F045]" />;
      case "LOW_CARB":
        return <Apple size={18} className="text-[#C7F045]" />;
      case "LOW_FAT":
        return <Coffee size={18} className="text-[#C7F045]" />;
      case "HIGH_CARB":
        return <Pizza size={18} className="text-[#C7F045]" />;
      default:
        return <Apple size={18} className="text-[#C7F045]" />;
    }
  };

  return (
    <div className="mt-4">
      {showFilters && (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Award size={18} className="text-[#C7F045]" />
            <h1 className="text-white/90 text-lg font-medium tracking-wide">
              Recommended Foods
            </h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-lg border border-gray-600 bg-[#1A1A1A] text-white flex-1 mb-2 sm:mb-0"
            />
            <select
              value={foodTypeFilter}
              onChange={(e) => setFoodTypeFilter(e.target.value)}
              className="p-2 rounded-lg border border-gray-600 bg-[#1A1A1A] text-white"
            >
              <option value="RECOMMENDED">Recommended ({user.goal})</option>
              <option value="HIGH_PROTEIN">High Protein</option>
              <option value="KETO">Keto</option>
              <option value="BALANCED">Balanced</option>
              <option value="LOW_CARB">Low Carb</option>
              <option value="LOW_FAT">Low Fat</option>
              <option value="HIGH_CARB">High Carb</option>
            </select>
          </div>
        </>
      )}

      {/* Food cards grid */}
      {displayedFoods.length === 0 ? (
        <p className="text-white text-center mt-10">No foods found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedFoods.map((food) => (
            <div
              key={food._id}
              className="bg-[#1A1A1A] border-0 p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer group 
              "
            >
              <div className="flex items-center justify-start mb-4">
                <div className="p-3 bg-[#C7F045]/10 rounded-xl group-hover:bg-[#C7F045]/20 transition-colors flex items-center">
                  {getIcon(food.foodType)}
                  <span className="ml-2 text-white font-light">{food.foodType}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{food.name}</h3>
              <p className="text-gray-300 text-sm">
                <strong>Protein:</strong> {food.protein}g | <strong>Carb:</strong> {food.carb}g |{" "}
                <strong>Fat:</strong> {food.fat}g
              </p>
              {recommendedFoods.includes(food) && (
                <span className="inline-block mt-2 px-2 py-1 text-xs text-[#C7F045] border border-[#C7F045] rounded-full">
                  Recommended
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Food;
