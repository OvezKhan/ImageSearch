import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  userId: String,
  term: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Search", searchSchema);
