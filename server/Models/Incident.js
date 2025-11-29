import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    description: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
}, { timestamps: true });

IncidentSchema.index({ reportedAt: -1 });

const Incident = mongoose.model("Incident", IncidentSchema);
export default Incident;


