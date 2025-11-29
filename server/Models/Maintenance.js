import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema({
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    type: { type: String, required: true },
    notes: { type: String },
    scheduledAt: { type: Date },
    completedAt: { type: Date }
}, { timestamps: true });

MaintenanceSchema.index({ bus: 1, scheduledAt: -1 });

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
export default Maintenance;


