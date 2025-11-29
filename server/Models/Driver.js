import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive", "on_leave"], default: "active" },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }
}, { timestamps: true });

DriverSchema.index({ licenseNo: 1 }, { unique: true });

const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;


