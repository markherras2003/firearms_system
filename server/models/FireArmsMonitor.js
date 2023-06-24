import mongoose from "mongoose";

const FireArmsMonitorSchema = new mongoose.Schema(
    {
        firearms_monitor_id: {
            type: Number,
            required: true,
            default: 1001,
            unique: true
        },
        personnel_id: {
            type: Number,
            required: true,
        },
        firearms_id: {
            type: Number,
            required: true,
        },
        check_in: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        check_out: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
    },
    { timestamps: true }
);

const FireArmsMonitor = mongoose.model("FireArmsMonitor", FireArmsMonitorSchema);
export default FireArmsMonitor;
