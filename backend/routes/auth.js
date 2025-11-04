import express from 'express';
import passport from 'passport';

const router = express.Router();

// --- THIS IS THE FIX ---
const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = isProduction
  ? 'https://image-search-alpha-mauve.vercel.app' // Your Vercel URL
  : 'http://localhost:3000'; // Your local React URL

// --- Google Routes ---
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: clientUrl, // Use the dynamic URL
    failureRedirect: `${clientUrl}/login` // Use the dynamic URL
  })
);

// --- GitHub Routes ---
router.get('/github', 
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: `${clientUrl}/login` // Use the dynamic URL
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(clientUrl); // Use the dynamic URL
  }
);

export default router;