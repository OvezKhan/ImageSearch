import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login"
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect("http://localhost:3000");
});

router.get('/github', 
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: 'http://localhost:3000/login' 
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/');
  }
);

export default router;
