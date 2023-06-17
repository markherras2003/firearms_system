import mongoose from "mongoose";

const PersonnelSchema = new mongoose.Schema(
    {
        personnel_id: {
            type: Number,
            required: true,
            default: 1001,
            unique: true
        },
        serial_no: {
            type: String,
            required:true,
            unique:true
        },
        fullname: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        personnel_rank: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        personnel_brsvc: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        personnel_email: {
            type: String,
            required: true,
            default: true,
            unique:true
        }
    },
    { timestamps: true }
);

const Personnel = mongoose.model("Personnel", PersonnelSchema);
export default Personnel;
