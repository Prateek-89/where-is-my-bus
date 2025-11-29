import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema({
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processed", "failed"], default: "pending" },
    processedAt: { type: Date }
}, { timestamps: true });

RefundSchema.index({ payment: 1 });

const Refund = mongoose.model("Refund", RefundSchema);
export default Refund;


