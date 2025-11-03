import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
// import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

passport.serializeUser((user, done) => done(null, user.id));
// In your passport/passport.js file

passport.deserializeUser(async (id, done) => {
  try {
    // 🛑 CRITICAL: Make sure 'User' model is imported/available here
    const user = await User.findById(id); 
    done(null, user); // User found and attached to req.user
  } catch (err) {
    done(err, null); // Error occurred, user is logged out
  }
});

// Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
  // callbackURL: "/auth/google/callback"
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",


}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user)
    user = await User.create({ name: profile.displayName, googleId: profile.id });
  done(null, user);
}));


// GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID ,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // callbackURL: "/auth/github/callback"
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/auth/github/callback",


}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ githubId: profile.id });
  if (!user)
    user = await User.create({ name: profile.displayName, githubId: profile.id });
  done(null, user);
}));


