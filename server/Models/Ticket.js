import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    ticketNumber: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date }
}, { timestamps: true });

TicketSchema.index({ ticketNumber: 1 }, { unique: true });

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;


