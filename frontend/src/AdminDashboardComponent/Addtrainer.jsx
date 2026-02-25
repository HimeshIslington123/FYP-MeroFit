import React, { useState } from "react";
import axios from "axios";

const AddTrainer = () => {
  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    specialistTrainer: "gain muscles",
    certifications: "",
    bio: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setTrainer((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in trainer) {
        if (trainer[key]) formData.append(key, trainer[key]);
      }

      const res = await axios.post(
        "http://localhost:4000/api/users/createtrainer",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
      setTrainer({
        name: "",
        email: "",
        password: "",
        address: "",
        specialistTrainer: "gain muscles",
        certifications: "",
        bio: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding trainer");
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Trainer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Name" value={trainer.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={trainer.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={trainer.password} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={trainer.address} onChange={handleChange} />

        <select name="specialistTrainer" value={trainer.specialistTrainer} onChange={handleChange}>
          <option value="weight loss">Weight Loss</option>
          <option value="gain muscles">Gain Muscles</option>
          <option value="stay fit">Stay Fit</option>
        </select>

        <input type="text" name="certifications" placeholder="Certifications (comma separated)" value={trainer.certifications} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={trainer.bio} onChange={handleChange} />

        <input type="file" name="image" onChange={handleImage} />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Add Trainer
        </button>
      </form>
    </div>
  );
};

export default AddTrainer;