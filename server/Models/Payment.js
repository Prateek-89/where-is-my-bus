import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    provider: { type: String },
    txnId: { type: String },
    paidAt: { type: Date },
    refundedAt: { type: Date }
}, { timestamps: true });

PaymentSchema.index({ booking: 1 });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;


