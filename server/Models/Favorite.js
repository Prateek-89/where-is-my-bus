import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["route", "bus", "stop"], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

FavoriteSchema.index({ user: 1, type: 1, refId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export default Favorite;


