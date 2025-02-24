import React, { useEffect, useState } from "react";
import "../styles.css"; 

const Search = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);


    useEffect(() => {
        const storedClothing = JSON.parse(localStorage.getItem("clothingItems")) || [];
        setClothingItems(storedClothing);
        setFilteredItems(storedClothing); 
    }, []);


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredItems(clothingItems);
            return;
        }

        const filtered = clothingItems.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(query);
            const categoryMatch = item.category.toLowerCase().includes(query);
            const colorMatch = item.color.toLowerCase().includes(query);
            return nameMatch || categoryMatch || colorMatch;
        });

        setFilteredItems(filtered);
    };

    return (
        <div className="auth-container">
            <h2>Search Clothing</h2>

            <input
                type="text"
                placeholder="Search by name, category, or color..."
                value={searchQuery}
                onChange={handleSearch}
                className="auth-input"
            />

            <div className="search-results">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="search-item">
                            <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="closet-image" />
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Color: {item.color}</p>
                        </div>
                    ))
                ) : (
                    <p>No matching items found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
