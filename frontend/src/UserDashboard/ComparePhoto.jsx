import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Plus, Download } from "lucide-react";
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
        alert("Upload successful");
        setTitle("");
        setImage(null);
        setIsOpen(false);

        const updated = await axios.get(
          "http://localhost:4000/progress/getProgress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgressList(updated.data);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // Download compare section
  const downloadCompare = async () => {
    const compareDiv = document.getElementById("compareid");

    if (!compareDiv) {
      alert("Open Compare first!");
      return;
    }

    try {
      const canvas = await html2canvas(compareDiv);

      const link = document.createElement("a");
      link.download = "comparison.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download comparison");
    }
  };

  return (
    <div className="bg-black w-full p-[20px] min-h-screen">
      {/* Upload Modal */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } h-[300px] w-[600px] transition-all duration-500 z-[999] translate-x-1/2 absolute flex flex-col bg-amber-50 p-6 rounded-xl shadow-md gap-4`}
      >
        <input
          className="border border-gray-300 rounded-md p-3"
          placeholder="Write the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-300 rounded-md p-2 cursor-pointer"
        />

        <button
          onClick={sendImage}
          className="bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-md py-3"
        >
          Submit
        </button>

        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 py-3 rounded-md text-white"
        >
          Cancel
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-[25px] font-light text-white lg:text-[30px] text-center mb-6">
        My progress photos
      </h1>

      {/* Filter + Upload */}
      <div className="w-full flex justify-between mb-6">
        <div className="w-[20%]">
          <Select
            options={[
              { value: "newest", label: "By newest" },
              { value: "oldest", label: "By oldest" },
            ]}
            placeholder="Filter by date"
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex justify-center p-[8px] rounded-[10px] w-[20%] items-center bg-[#C7F045]"
        >
          Upload image <Plus size={20} />
        </button>
      </div>

      {/* Show Compare / Download Buttons */}
      {selectedImages.length >= 2 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="bg-white p-2 rounded font-semibold"
          >
            {showCompare
              ? "Hide Compare"
              : `Compare Selected (${selectedImages.length})`}
          </button>

          {showCompare && (
            <button
              onClick={downloadCompare}
              className="bg-green-500 p-2 rounded text-white font-semibold"
            >
              Download Compare
            </button>
          )}
        </div>
      )}

      {/* Compare Section */}
      {showCompare && selectedImages.length >= 2 && (
        <div
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "rgb(255,255,255)",
          }}
          id="compareid"
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6  p-4 rounded-lg"
        >
          {selectedImages.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-white">
              <img
                src={item.image}
                className="w-[200px] h-[200px] object-contain rounded-lg border"
              />
              <p className="mt-2text-[16px]">{item.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progress List */}
      <div className="w-full h-full overflow-y-auto text-white flex flex-col gap-[20px]">
        {progressList.length === 0 ? (
          <p>No progress uploaded yet.</p>
        ) : (
          progressList.map((p, index) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-[20px]"
            >
              <div className="flex justify-center items-center gap-[10px]">
                <input
                  type="checkbox"
                  checked={selectedImages.some((img) => img.image === p.image)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages((prev) => [
                        ...prev,
                        { image: p.image, title: p.title },
                      ]);
                    } else {
                      setSelectedImages((prev) =>
                        prev.filter((x) => x.image !== p.image)
                      );
                    }
                  }}
                  className="h-[20px] w-[20px]"
                />
                <h1>{index + 1}.</h1>
              </div>

              <img
                src={p.image}
                alt={p.title}
                className="w-[200px] h-[200px] object-contain"
              />

              <h1>{p.title}</h1>

              <a href={p.image} download={p.title}>
                <Download size={30} color="#fafafa" strokeWidth={1.5} />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComparePhoto;
