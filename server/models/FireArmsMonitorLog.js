import mongoose from "mongoose";

const FireArmsMonitorLogSchema = new mongoose.Schema(
    {
        firearms_monitor_log_id: {
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
            min: 2,
            max: 50,
        },
        firearms_purpose: {
            type: String,
            min: 2,
            max: 50,
        },
        firearms_status: {
            type: String,
            min: 2,
            max: 50,
        },
        firearms_qrcode: {
            type: String,
            min: 2,
            max: 50,
        },
        check_in: {
            type: Date,
        },
        check_out: {
            type: Date,
        },
    },
    { timestamps: true }
);

const FireArmsMonitorLog = mongoose.model("FireArmsMonitorLog", FireArmsMonitorLogSchema);
export default FireArmsMonitorLog;
