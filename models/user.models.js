import mongoose from "mongoose";

const userSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model("User", userSchema);