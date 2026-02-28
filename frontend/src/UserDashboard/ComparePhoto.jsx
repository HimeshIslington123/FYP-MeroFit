import React, { useEffect, useState } from "react";
import { Plus, Download, Image as ImageIcon, X, Check } from "lucide-react";
import axios from "axios";
import html2canvas from "html2canvas";

const ComparePhoto = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [progressList, setProgressList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Fetch progress photos
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/progress/getProgress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgressList(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  // Upload new image
  const sendImage = async () => {
    if (!title || !image) {
      alert("Please provide title and image");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:4000/progress/bodyprogress",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setTitle("");
        setImage(null);
        setIsOpen(false);
        const updated = await axios.get(
          "http://localhost:4000/progress/getProgress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgressList(updated.data);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // Download compare
  const downloadCompare = async () => {
    const compareDiv = document.getElementById("compareid");
    if (!compareDiv) return;
    try {
      // Temporarily make it visible if hidden
      const originalDisplay = compareDiv.style.display;
      compareDiv.style.display = "block";

      const canvas = await html2canvas(compareDiv);
      const link = document.createElement("a");
      link.download = "fitness-comparison.png";
      link.href = canvas.toDataURL();
      link.click();

      compareDiv.style.display = originalDisplay; // restore
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-8 lg:p-12">
      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upload Progress</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 ml-2">Photo Title</label>
                <input
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#2bb3a3]/20"
                  placeholder="e.g., Week 12 Front View"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-[#2bb3a3] transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <ImageIcon size={40} className="text-gray-300 mb-2" />
                  <span className="text-gray-500 text-sm">{image ? image.name : "Click to select photo"}</span>
                </label>
              </div>

              <button
                onClick={sendImage}
                className="w-full bg-[#2bb3a3] hover:bg-[#249c8e] text-white font-bold rounded-2xl py-4 shadow-lg shadow-[#2bb3a3]/30 transition-all"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Visual Journey</h1>
          <p className="text-gray-500 text-lg">Track your transformation over time.</p>
        </div>

        <div className="flex gap-3">
          {selectedImages.length >= 2 && (
            <button
              onClick={() => setShowCompare(!showCompare)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                showCompare ? "bg-gray-800 text-white" : "bg-white border border-gray-100 text-gray-700 shadow-sm"
              }`}
            >
              {showCompare ? "Close Compare" : `Compare (${selectedImages.length})`}
            </button>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#2bb3a3] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#2bb3a3]/20 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Add Photo
          </button>
        </div>
      </div>

      {/* Comparison Section */}
      <div className={`${showCompare ? "block" : "hidden"} max-w-7xl mx-auto mb-12`}>
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-8 px-4">
            <h3 className="text-xl font-bold text-gray-800">Side-by-Side Comparison</h3>
            <button
              onClick={downloadCompare}
              className="flex items-center gap-2 text-[#2bb3a3] font-bold hover:underline"
            >
              <Download size={20} /> Download Result
            </button>
          </div>

          <div
            id="compareid"
            className="bg-white p-6 rounded-[2rem] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {selectedImages.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-gray-100">
                  <img src={item.image} className="w-full h-full object-cover" alt="comparison" />
                </div>
                <p className="mt-3 text-center font-bold text-gray-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {progressList.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400">Your visual journey starts here. Upload your first photo!</p>
          </div>
        ) : (
          progressList.map((p, index) => {
            const isSelected = selectedImages.some((img) => img.image === p.image);
            return (
              <div
                key={p.id || index}
                className={`group relative bg-white rounded-[2rem] p-4 border transition-all duration-300 ${
                  isSelected ? "border-[#2bb3a3] shadow-md scale-[1.02]" : "border-gray-100 hover:shadow-xl"
                }`}
              >
                {/* Checkbox */}
                <div className="absolute top-6 left-6 z-10">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer h-6 w-6 opacity-0 absolute"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, { image: p.image, title: p.title }]);
                        } else {
                          setSelectedImages(selectedImages.filter((x) => x.image !== p.image));
                        }
                      }}
                    />
                    <div className="h-6 w-6 border-2 border-white bg-white/50 backdrop-blur rounded-full flex items-center justify-center peer-checked:bg-[#2bb3a3] peer-checked:border-[#2bb3a3] transition-all shadow-sm">
                      <Check size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </label>
                </div>

                {/* Photo */}
                <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] mb-4 bg-gray-50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-2 pb-2">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#2bb3a3] uppercase tracking-wider mb-1">Entry #{index + 1}</p>
                    <h4 className="font-bold text-gray-800 truncate">{p.title}</h4>
                  </div>
                  <a 
                    href={p.image} 
                    download={p.title} 
                    className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ComparePhoto;