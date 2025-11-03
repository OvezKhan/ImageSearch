import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
  githubId: String,
  
});

export default mongoose.model("User", userSchema);
