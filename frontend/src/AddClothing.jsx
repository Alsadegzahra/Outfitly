import { useState } from "react";

export default function AddClothing() {
  const [clothing, setClothing] = useState({ name: "", category: "", color: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Clothing Added:", clothing);
    setClothing({ name: "", category: "", color: "" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-blue-600">Add Clothing</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md w-full max-w-sm mt-4">
        <input
          type="text"
          placeholder="Clothing Name"
          value={clothing.name}
          onChange={(e) => setClothing({ ...clothing, name: e.target.value })}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={clothing.category}
          onChange={(e) => setClothing({ ...clothing, category: e.target.value })}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <input
          type="text"
          placeholder="Color"
          value={clothing.color}
          onChange={(e) => setClothing({ ...clothing, color: e.target.value })}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
          Add Clothing
        </button>
      </form>
    </div>
  );
}
