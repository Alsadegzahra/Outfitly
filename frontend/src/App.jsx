import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* App Name */}
      <h1 className="text-4xl font-bold text-blue-600 mt-6">Outfitly </h1>

      {/* Welcome Text */}
      <p className="text-gray-700 text-lg text-center mt-4">
        Welcome.
      </p>

      {/* Button to Navigate to Add Clothing */}
      <Link to="/add-clothing">
        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg text-lg">
          Add Clothing
        </button>
      </Link>
    </div>
  );
}
