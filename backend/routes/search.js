import express from "express";
import axios from "axios";
import Search from "../models/Search.js";

const router = express.Router();

// Middleware to ensure user is logged in (MUST be defined and imported/accessible)
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Returning 401 Unauthorised if user is not logged in
    res.status(401).json({ message: "Access denied. Please log in." });
};

// --- POST /api/search ---
// Only accessible to logged-in users. Logs the search and calls Unsplash.
router.post("/search", isAuthenticated, async (req, res) => {
    // 🛑 FIX: Get user ID securely from req.user, not req.body
    const userId = req.user._id; 
    const { term } = req.body;
    
    // Check if the term is valid
    if (!term || term.trim() === "") {
        return res.status(400).json({ message: "Search term cannot be empty." });
    }

    try {
        // 1. Store the search history
        await Search.create({ userId, term });

        // 2. Call Unsplash Search API
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: { query: term },
            // Ensure UNSPLASH_ACCESS_KEY is loaded via dotenv in server.js
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });

        // 3. Return image results
        res.json(response.data.results);
    } catch (error) {
        console.error("Unsplash API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch images." });
    }
});

// --- GET /api/top-searches ---
// Accessible publicly. Displays the top 5 most frequent search terms across all users[cite: 16].
router.get("/top-searches", async (req, res) => {
    try {
        const top = await Search.aggregate([
            { $group: { _id: "$term", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json(top);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve top searches." });
    }
});

// --- GET /api/history ---
// Only accessible to logged-in users. Shows the logged-in user's past search terms[cite: 31].
router.get("/history", isAuthenticated, async (req, res) => {
    // 🛑 FIX: Remove the ":userId" param and use req.user._id securely
    const userId = req.user._id;

    try {
        const history = await Search.find({ userId: userId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve search history." });
    }
});

export default router;