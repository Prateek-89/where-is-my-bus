import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    departures: [{ type: String, match: /^\d{2}:\d{2}$/ }],
    notes: { type: String }
}, { timestamps: true });

TimetableSchema.index({ route: 1, dayOfWeek: 1 }, { unique: true });

const Timetable = mongoose.model("Timetable", TimetableSchema);
export default Timetable;


