import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import "../styles.css";

const Home = () => {
    const [recentOutfit, setRecentOutfit] = useState(null);
    const [mostWornItem, setMostWornItem] = useState(null);
    const [outfitsExist, setOutfitsExist] = useState(false); // ✅ Track if outfits exist

    useEffect(() => {
        console.log("📡 Fetching outfits...");
        const unsubscribe = onSnapshot(collection(db, "outfits"), async (snapshot) => {
            const outfits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched outfits:", outfits);

            if (outfits.length > 0) {
                setOutfitsExist(true); // ✅ Mark that outfits exist
                const sortedOutfits = outfits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const latestOutfit = sortedOutfits[0];

                // ✅ Fetch Item Details
                const itemsWithDetails = await Promise.all(
                    latestOutfit.items.map(async (itemId) => {
                        const itemRef = doc(db, "clothing", itemId);
                        const itemSnap = await getDoc(itemRef);
                        return itemSnap.exists() ? { id: itemId, ...itemSnap.data() } : null;
                    })
                );

                setRecentOutfit({ ...latestOutfit, items: itemsWithDetails.filter(Boolean) });
            } else {
                setOutfitsExist(false);
            }
        });

        return () => unsubscribe(); // ✅ Cleanup Firestore listener
    }, []);

    useEffect(() => {
        if (!outfitsExist) return; // ✅ Don't fetch most worn item if no outfits

        console.log("📡 Fetching most worn item...");
        const unsubscribe = onSnapshot(collection(db, "outfits"), async (snapshot) => {
            const outfits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (outfits.length > 0) {
                const itemUsage = {};
                outfits.forEach(outfit => {
                    if (outfit.items) {
                        outfit.items.forEach(itemId => {
                            itemUsage[itemId] = (itemUsage[itemId] || 0) + 1;
                        });
                    }
                });

                const mostWornItemId = Object.keys(itemUsage).reduce((a, b) => itemUsage[a] > itemUsage[b] ? a : b, null);
                console.log("Most worn item ID:", mostWornItemId);

                if (mostWornItemId) {
                    const itemRef = doc(db, "clothing", mostWornItemId);
                    const docSnap = await getDoc(itemRef);
                    if (docSnap.exists()) {
                        setMostWornItem({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        console.log("Most worn item not found in clothing collection.");
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [outfitsExist]); // ✅ Only run if outfits exist

    return (
        <div className="home-container">
            <h2>Welcome to Outfitly</h2>

            {!outfitsExist ? ( // ✅ If no outfits, show message
                <p>⚠️ You have no outfits yet. Start logging your outfits!</p>
            ) : (
                <>
                    {recentOutfit && (
                        <div className="home-section">
                            <h3>👗 Most Recent Outfit</h3>
                            <p><strong>{recentOutfit.name}</strong></p>
                            <div className="items-container">
                                {recentOutfit.items.length > 0 ? (
                                    recentOutfit.items.map(item => (
                                        <div key={item.id} className="item">
                                            <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} />
                                            <p><strong>{item.name}</strong></p>
                                            <p>Category: {item.category}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No items in this outfit.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {mostWornItem && (
                        <div className="home-section">
                            <h3>🔥 Most Worn Item</h3>
                            <div className="item">
                                <img src={mostWornItem.image || "https://via.placeholder.com/100"} alt={mostWornItem.name} />
                                <p><strong>{mostWornItem.name}</strong></p>
                                <p>Category: {mostWornItem.category}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
