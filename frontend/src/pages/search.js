import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles.css"; // ✅ Import global styles

/**
 * Search component allows users to search for clothing and outfits in real-time.
 * 
 * @component
 * @returns {JSX.Element} - Rendered Search component.
 */
const Search = () => {
    const [queryInput, setQueryInput] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [clothingResults, setClothingResults] = useState([]);
    const [outfitResults, setOutfitResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clothingMap, setClothingMap] = useState({});
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const unsubscribeClothing = onSnapshot(collection(db, "clothing"), (clothingSnapshot) => {
            const clothingData = {};
            clothingSnapshot.forEach(doc => {
                clothingData[doc.id] = { id: doc.id, ...doc.data() };
            });

            setClothingMap(clothingData);
        });

        return () => unsubscribeClothing();
    }, []);

    useEffect(() => {
        const unsubscribeOutfits = onSnapshot(collection(db, "outfits"), (outfitSnapshot) => {
            const outfitData = outfitSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                items: doc.data().items || [],
            }));

            setOutfits(outfitData);
        });

        return () => unsubscribeOutfits();
    }, []);

    /**
     * Filters clothing items based on search input, category, and color.
     */
    const searchClothing = () => {
        setLoading(true);
        const results = Object.values(clothingMap).filter(item =>
            (!queryInput || item.name.toLowerCase().includes(queryInput.toLowerCase())) &&
            (!category || item.category.toLowerCase() === category.toLowerCase()) &&
            (!color || item.color.toLowerCase() === color.toLowerCase())
        );
        setClothingResults(results);
        setLoading(false);
    };

    /**
     * Filters outfits based on search input and maps clothing items to them.
     */
    const searchOutfits = () => {
        setLoading(true);
        const results = outfits
            .filter(outfit =>
                !queryInput || outfit.name.toLowerCase().includes(queryInput.toLowerCase())
            )
            .map(outfit => ({
                ...outfit,
                items: outfit.items.map(itemId => clothingMap[itemId]).filter(Boolean),
            }));

        setOutfitResults(results);
        setLoading(false);
    };

    /**
     * Initiates search for both clothing and outfits.
     */
    const searchAll = () => {
        setClothingResults([]);
        setOutfitResults([]);
        searchClothing();
        searchOutfits();
    };

    return (
        <div className="auth-container">
            <h2>🔍 Search Your Closet & Outfits</h2>

            <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search for clothing or outfits..."
                className="search-bar"
            />
            <button 
                onClick={searchAll} 
                className="auth-button"
                disabled={loading}
            >
                {loading ? "Searching..." : "🔍 Search"}
            </button>

            <div className="filters">
                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">All Categories</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                </select>

                <select onChange={(e) => setColor(e.target.value)} value={color}>
                    <option value="">All Colors</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                </select>
            </div>

            <div className="results-container">
                {clothingResults.length > 0 && (
                    <div>
                        <h3>👕 Clothing Items</h3>
                        <div className="results-grid">
                            {clothingResults.map((item) => (
                                <div key={item.id} className="result-card">
                                    <img 
                                        src={item.image || "https://placehold.co/100"} 
                                        alt={item.name} 
                                    />
                                    <p>{item.name} - {item.category} - {item.color}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {outfitResults.length > 0 && (
                    <div>
                        <h3>👗 Outfits</h3>
                        <div className="results-grid">
                            {outfitResults.map((outfit) => (
                                <div key={outfit.id} className="result-card">
                                    <h3>{outfit.name}</h3>
                                    <div className="outfit-items">
                                        {outfit.items.map((item) => (
                                            <div key={item.id}>
                                                <img src={item.image || "https://placehold.co/100"} alt={item.name} />
                                                <p>{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {clothingResults.length === 0 && outfitResults.length === 0 && !loading && <p className="no-results">⚠️ No results found.</p>}
            </div>
        </div>
    );
};

export default Search;
