// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Wardrobe from "./pages/Closet";
import AddClothing from "./pages/AddClothing";
import LogOutfit from "./pages/logOutfit";
import OutfitHistory from "./pages/outfitHistory";
import Search from "./pages/search";

function App() {
  return (
    <Router>
      <div className="App">
      <h1>Outfitly</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/add" element={<AddClothing />} />
        <Route path="/log-outfit" element={<LogOutfit />} />
        <Route path="/outfit-history" element={<OutfitHistory />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;

