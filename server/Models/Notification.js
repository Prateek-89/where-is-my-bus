import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: Object },
    readAt: { type: Date }
}, { timestamps: true });

NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;


