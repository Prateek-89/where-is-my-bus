import mongoose from "mongoose";

const StopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    sequence: { type: Number, required: true },
    etaOffsetMin: { type: Number, default: 0 }
}, { timestamps: true });

StopSchema.index({ name: 1 });
StopSchema.index({ sequence: 1 });

const Stop = mongoose.model("Stop", StopSchema);
export default Stop;


