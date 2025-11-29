import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    changes: { type: Object },
    at: { type: Date, default: Date.now }
}, { timestamps: true });

AuditLogSchema.index({ at: -1 });

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
export default AuditLog;


