import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const navigate = useNavigate();
    const [clothingItems, setClothingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    // Load wardrobe items from localStorage
    useEffect(() => {
        const storedClothing = JSON.parse(localStorage.getItem("clothingItems")) || [];
        setClothingItems(storedClothing);
        setFilteredItems(storedClothing); // Default: show all items
    }, []);

    // Handle search
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
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Search Clothing</h2>

            <input
                type="text"
                placeholder="Search by color, category, or both..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.input}
            />

            <div style={styles.resultsContainer}>
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} style={styles.clothingItem}>
                            <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} style={styles.image} />
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

const styles = {
    container: { textAlign: "center", padding: "20px" },
    homeButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" },
    input: { margin: "10px", padding: "10px", width: "80%", fontSize: "16px" },
    resultsContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" },
    clothingItem: { border: "1px solid #ddd", margin: "10px", padding: "10px", width: "200px", textAlign: "center" },
    image: { width: "100%", borderRadius: "5px" },
};

export default Search;
