import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import "../styles.css";

const Home = () => {
    const [mostRecentOutfit, setMostRecentOutfit] = useState(null);
    const [mostWornItem, setMostWornItem] = useState(null);
    const [leastWornItem, setLeastWornItem] = useState(null);
    const [recentClothing, setRecentClothing] = useState(null);

    useEffect(() => {
        // Fetch Outfits
        const unsubscribeOutfits = onSnapshot(collection(db, "outfits"), (snapshot) => {
            const fetchedOutfits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Get Most Recent Outfit
            const sortedOutfits = fetchedOutfits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMostRecentOutfit(sortedOutfits.length > 0 ? sortedOutfits[0] : null);

            // Count Item Occurrences
            const itemCount = {};
            fetchedOutfits.forEach(outfit => {
                outfit.items.forEach(item => {
                    if (item.id in itemCount) {
                        itemCount[item.id].count += 1;
                    } else {
                        itemCount[item.id] = { ...item, count: 1 };
                    }
                });
            });

            // Find Most & Least Worn Items
            const itemsArray = Object.values(itemCount).filter(item => item.count > 0);
            if (itemsArray.length > 0) {
                setMostWornItem(itemsArray.reduce((max, item) => (item.count > max.count ? item : max), itemsArray[0]));
                setLeastWornItem(itemsArray.reduce((min, item) => (item.count < min.count ? item : min), itemsArray[0]));
            } else {
                setMostWornItem(null);
                setLeastWornItem(null);
            }
        });

        // Fetch Recently Added Clothing
        const unsubscribeClothing = onSnapshot(
            query(collection(db, "clothing"), orderBy("createdAt", "desc"), limit(1)),
            (snapshot) => {
                const latestClothing = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecentClothing(latestClothing.length > 0 ? latestClothing[0] : null);
            }
        );

        return () => {
            unsubscribeOutfits();
            unsubscribeClothing();
        };
    }, []);

    return (
        <div className="home-container">
            <h1 className="welcome-message">👗 Welcome to Outfitly! 👕</h1>

            <div className="home-grid">
                {/* ✅ Left Column (Correct Order) */}
                <div className="left-column">
                    <div className="box">
                        <h3>👕 Most Recent Outfit</h3>
                        {mostRecentOutfit ? (
                            <>
                                <p><strong>{mostRecentOutfit.name}</strong></p>
                                <div className="outfit-items">
                                    {mostRecentOutfit.items.map(item => (
                                        <div key={item.id} className="outfit-item">
                                            <img className="item-img" src={item.image || "https://placehold.co/100"} alt={item.name} />
                                            <p>{item.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>No outfits logged yet.</p>
                        )}
                    </div>

                    <div className="box">
                        <h3>🆕 Recently Added Clothing</h3>
                        {recentClothing ? (
                            <>
                                <img className="item-img" src={recentClothing.image || "https://placehold.co/100"} alt={recentClothing.name} />
                                <p><strong>{recentClothing.name}</strong></p>
                                <p>Added Recently</p>
                            </>
                        ) : (
                            <p>No new clothing added yet.</p>
                        )}
                    </div>
                </div>

                {/* ✅ Right Column (Correct Order) */}
                <div className="right-column">
                    <div className="box">
                        <h3>🔥 Most Worn Item</h3>
                        {mostWornItem ? (
                            <>
                                <img className="item-img" src={mostWornItem.image || "https://placehold.co/100"} alt={mostWornItem.name} />
                                <p><strong>{mostWornItem.name}</strong></p>
                                <p>Worn {mostWornItem.count} times</p>
                            </>
                        ) : (
                            <p>No data yet.</p>
                        )}
                    </div>

                    <div className="box">
                        <h3>❄️ Least Worn Item</h3>
                        {leastWornItem ? (
                            <>
                                <img className="item-img" src={leastWornItem.image || "https://placehold.co/100"} alt={leastWornItem.name} />
                                <p><strong>{leastWornItem.name}</strong></p>
                                <p>Worn {leastWornItem.count} times</p>
                            </>
                        ) : (
                            <p>No data yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
