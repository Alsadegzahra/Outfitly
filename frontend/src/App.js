import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import Closet from "./pages/Closet";
import AddClothing from "./pages/AddClothing";
import LogOutfit from "./pages/LogOutfit";
import OutfitHistory from "./pages/OutfitHistory";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { motion } from "framer-motion";
import "./styles.css";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

const App = () => {
  return (
    <Router>
      <div className="app-container bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <motion.div className="content p-6 flex-grow" initial="initial" animate="animate" exit="exit" variants={pageTransition}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/outfit-history" element={<OutfitHistory />} />
            <Route path="/add-clothing" element={<AddClothing />} />
            <Route path="/log-outfit" element={<LogOutfit />} />
            <Route path="/search" element={<Search />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
};

export default App;