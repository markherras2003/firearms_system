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
        firearms_serialno: {
            type: String,
            required: true,
            unique: true,
            min: 2,
            max: 50,
        },
        firearms_qrcode: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        check_in: {
            type: Date,
            required: true,
        },
        check_out: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const FireArmsMonitor = mongoose.model("FireArmsMonitor", FireArmsMonitorSchema);
export default FireArmsMonitor;
