import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    tags: [{ type: String }]
}, { timestamps: true });

FeedbackSchema.index({ user: 1, createdAt: -1 });

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;


