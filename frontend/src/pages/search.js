import React, { useState, useEffect } from "react";

const Search = () => {
    const [query, setQuery] = useState("");
    const [clothingResults, setClothingResults] = useState([]);
    const [outfitResults, setOutfitResults] = useState([]);

    const fetchAllItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/search?q=");
            const data = await response.json();

            console.log("🔍 Initial API Response:", data);

            setClothingResults(data.clothing || []);
            setOutfitResults(data.outfits || []);
        } catch (error) {
            console.error("❌ Error fetching search results:", error);
        }
    };

    useEffect(() => {
        fetchAllItems(); // ✅ Load all items when the page opens
    }, []);

    const searchClothing = async () => {
        if (!query.trim()) return fetchAllItems(); // ✅ If empty query, show everything

        try {
            const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            console.log("🔍 Search API Response:", data);

            setClothingResults(data.clothing || []);
            setOutfitResults(data.outfits || []);
        } catch (error) {
            console.error("❌ Error fetching search results:", error);
        }
    };

    return (
        <div>
            <h2>Search Your Closet & Outfits</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for clothing or outfits..."
                style={{ padding: "10px", width: "80%" }}
            />
            <button 
                onClick={searchClothing} 
                style={{ padding: "10px", marginLeft: "5px", cursor: "pointer" }}
            >
                🔍 Search
            </button>

            <div style={{ marginTop: "20px" }}>
                {/* ✅ Show Clothing Items */}
                {clothingResults.length > 0 && (
                    <div>
                        <h3>Clothing Items</h3>
                        {clothingResults.map((item) => (
                            <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                <img 
                                    src={item.image || "https://placehold.co/100"} 
                                    alt={item.name} 
                                    style={{ width: "80px", height: "80px", borderRadius: "5px" }}
                                />
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ Show Outfits */}
                {outfitResults.length > 0 && (
                    <div>
                        <h3>Outfits</h3>
                        {outfitResults.map((outfit) => (
                            <div key={outfit._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                                <h4>{outfit.name}</h4>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {outfit.items.length > 0 ? (
                                        outfit.items.map((item) => (
                                            <div key={item._id} style={{ textAlign: "center" }}>
                                                <img 
                                                    src={item.image || "https://placehold.co/80"} 
                                                    alt={item.name} 
                                                    style={{ width: "80px", height: "80px", borderRadius: "5px" }}
                                                />
                                                <p>{item.name}</p> {/* ✅ Show item names */}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No items in this outfit.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ Show message if no results */}
                {clothingResults.length === 0 && outfitResults.length === 0 && (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
