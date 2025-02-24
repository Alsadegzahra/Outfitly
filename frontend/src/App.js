import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import Home from "./pages/Home";
import Closet from "./pages/Closet";
import AddClothing from "./pages/AddClothing";
import LogOutfit from "./pages/LogOutfit";
import OutfitHistory from "./pages/OutfitHistory";
import Search from "./pages/Search";

function App() {
    return (
        <Router>
            {/* ✅ Navbar must be outside <Routes> */}
            <Navbar />  
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wardrobe" element={<Closet />} />
                <Route path="/add" element={<AddClothing />} />
                <Route path="/log-outfit" element={<LogOutfit />} />
                <Route path="/outfit-history" element={<OutfitHistory />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </Router>
    );
}

export default App;
