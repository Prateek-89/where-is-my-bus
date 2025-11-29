import mongoose from "mongoose";

const CoordinatesSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { _id: false });

const StopSubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, required: true },
    estimatedTime: { type: Number, default: 0 }
}, { _id: false });

const RouteSchema = new mongoose.Schema({
    routeNumber: { type: String, required: true, unique: true },
    routeName: { type: String, required: true },
    startPoint: {
        name: String,
        coordinates: CoordinatesSchema
    },
    endPoint: {
        name: String,
        coordinates: CoordinatesSchema
    },
    stops: [StopSubSchema],
    totalDistance: { type: Number, required: true },
    estimatedDuration: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

RouteSchema.index({ routeNumber: 1 }, { unique: true });

const Route = mongoose.model("Route", RouteSchema);
export default Route;


