import React, { useState } from "react";

const Search = ({ clothingItems }) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    setFilteredItems(
      clothingItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      )
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for clothing..."
        value={query}
        onChange={handleSearch}
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
