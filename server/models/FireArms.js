import mongoose from "mongoose";

const FireArmsSchema = new mongoose.Schema(
    {
        firearms: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        personnel_id: {
            type: Number,
            required: false,
        },
        firearms_serialno: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        firearms_qrcode: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        firearms_isperson: {
            type: Boolean,
            required: true,
            default: true,
        },
        firearms_id: {
            type: Number,
            required: true,
            default: 1001,
            unique: true
        },
    },
    { timestamps: true }
);

const FireArms = mongoose.model("FireArms", FireArmsSchema);
export default FireArms;
