import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    busName: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    currentLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

BusSchema.index({ busNumber: 1 }, { unique: true });

const Bus = mongoose.model("Bus", BusSchema);
export default Bus;


