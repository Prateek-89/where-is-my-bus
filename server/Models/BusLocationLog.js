import mongoose from "mongoose";

const BusLocationLogSchema = new mongoose.Schema({
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    speedKph: { type: Number, default: 0 },
    headingDeg: { type: Number, default: 0 },
    at: { type: Date, default: Date.now }
}, { timestamps: true });

BusLocationLogSchema.index({ bus: 1, at: -1 });

const BusLocationLog = mongoose.model("BusLocationLog", BusLocationLogSchema);
export default BusLocationLog;


