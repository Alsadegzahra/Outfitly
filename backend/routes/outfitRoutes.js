const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); // ✅ Import Firestore
const { collection, addDoc, getDocs, doc, deleteDoc, query, where } = require("firebase/firestore");

// ✅ Create a New Outfit (Firestore)
router.post("/", async (req, res) => {
    try {
        console.log("📩 Received Outfit Data:", req.body);

        const { name, items } = req.body;

        if (!name || !items || !Array.isArray(items)) {
            console.log("❌ Missing required fields:", { name, items });
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newOutfit = { name, items, createdAt: new Date() };
        const docRef = await addDoc(collection(db, "outfits"), newOutfit);

        console.log("✅ Outfit saved successfully:", newOutfit);
        res.status(201).json({ id: docRef.id, ...newOutfit });
    } catch (error) {
        console.error("❌ Error saving outfit:", error);
        res.status(500).json({ error: "Error saving outfit" });
    }
});

// ✅ Get All Outfits (Firestore)
router.get("/", async (req, res) => {
    try {
        const { category, color } = req.query;
        let outfitQuery = collection(db, "outfits");

        const querySnapshot = await getDocs(outfitQuery);
        const outfitData = await Promise.all(
            querySnapshot.docs.map(async (outfitDoc) => {
                const outfit = outfitDoc.data();
                const itemRefs = outfit.items || [];

                // Fetch associated clothing items from Firestore
                const itemData = await Promise.all(
                    itemRefs.map(async (itemId) => {
                        const itemDoc = await getDocs(query(collection(db, "clothing"), where("id", "==", itemId)));
                        return itemDoc.docs.length > 0 ? { id: itemId, ...itemDoc.docs[0].data() } : null;
                    })
                );

                // Apply category & color filters if provided
                let filteredItems = itemData.filter(item => item);
                if (category) filteredItems = filteredItems.filter(item => item.category === category);
                if (color) filteredItems = filteredItems.filter(item => item.color === color);

                return { id: outfitDoc.id, name: outfit.name, items: filteredItems };
            })
        );

        res.json(outfitData);
    } catch (error) {
        console.error("❌ Error fetching outfits:", error);
        res.status(500).json({ error: "Error fetching outfits" });
    }
});

// ✅ Delete an Outfit (Firestore)
router.delete("/:id", async (req, res) => {
    try {
        const outfitId = req.params.id;
        const outfitRef = doc(db, "outfits", outfitId);

        await deleteDoc(outfitRef);
        res.json({ message: "Outfit deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting outfit:", error);
        res.status(500).json({ error: "Error deleting outfit" });
    }
});

module.exports = router;
