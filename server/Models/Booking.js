import mongoose from "mongoose";

const CoordinatesSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { _id: false });

const NamedPointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, required: true }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    fromStop: { type: NamedPointSchema, required: true },
    toStop: { type: NamedPointSchema, required: true },
    travelDate: { type: Date, required: true },
    seatNumber: { type: String, required: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    bookingDate: { type: Date, default: Date.now },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
}, { timestamps: true });

BookingSchema.index({ bus: 1, travelDate: 1, seatNumber: 1 }, { unique: true });

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;


