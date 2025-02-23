import React from "react";

const OutfitHistory = ({ history = [] }) => {
  return (
    <div>
      <h2>Outfit History</h2>
      {history.length === 0 ? (
        <p>No outfits logged yet.</p>
      ) : (
        <ul>
          {history.map((outfit, index) => (
            <li key={index}>{outfit.date} - {outfit.items.join(", ")}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OutfitHistory;
