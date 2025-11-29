import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    fromStop: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    toStop: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    travelDate: {
        type: Date,
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    }
}, {
    timestamps: true
});

const TicketSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true
    },
    qrCode: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", BookingSchema);
const Ticket = mongoose.model("Ticket", TicketSchema);

export { Booking, Ticket };
