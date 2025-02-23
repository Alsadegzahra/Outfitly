import React, { useState, useEffect } from "react";
import { getClothes, addClothing } from "../services/clothingService";

const categories = ["Top", "Bottom", "Shoes", "Accessories", "Outerwear"];
const colors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Yellow", "Pink", "Purple", "Brown"];

const ClothingList = () => {
  const [clothes, setClothes] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", color: "", image: null });

  useEffect(() => {
    fetchClothes();
  }, []);

  const fetchClothes = async () => {
    const data = await getClothes();
    setClothes(data);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("color", form.color);
    if (form.image) {
      formData.append("image", form.image);
    }

    await addClothing(formData);
    setForm({ name: "", category: "", color: "", image: null });
    fetchClothes();
  };

  return (
    <div>
      <h2>Clothing List</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="color" value={form.color} onChange={handleChange} required>
          <option value="">Select Color</option>
          {colors.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        
        <button type="submit">Add Clothing</button>
      </form>

      <ul>
        {clothes.map((item) => (
          <li key={item._id}>
            {item.name} - {item.category} - {item.color}
            {item.image && <img src={`http://localhost:5000${item.image}`} alt={item.name} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClothingList;
