import mongoose from "mongoose";

const JobOrderSchema = new mongoose.Schema(
    {
        job_id: {
            type: Number,
            required: true,
            default: 1001,
            unique: true
        },
        client_name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        unit_description: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        unit_model: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        unit_accessories: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        unit_problem: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        resolution: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        received_by: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        job_order_by: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        tech_incharge: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        phone_no: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const JobOrder = mongoose.model("JobOrder", JobOrderSchema);
export default JobOrder;
