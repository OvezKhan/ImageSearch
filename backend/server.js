import './config.js';

// console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI);
// console.log("✅ Loaded GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from 'express-session';

import passport from "passport";
import "./passport/passport.js";
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/api", searchRoutes);

// 1. Endpoint to check who is currently logged in (for AuthContext)
app.get("/api/me", (req, res) => {
  if (req.user) {
    // req.user is added by Passport.js session
    res.json(req.user);
  } else {
    // Not authenticated
    res.status(401).json({ message: "Not authenticated" });
  }
});

// 2. Endpoint to log out (for AuthContext)
app.post("/auth/logout", (req, res, next) => {
  // req.logout() is a Passport.js function
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Destroy the session on the server
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out." });
      }
      // Clear the cookie on the client side
      res.clearCookie('connect.sid'); // The default session cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log(err));


app.listen(5000, () => console.log("Server running on port 5000"));


// In your backend server file

