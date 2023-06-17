import mongoose from "mongoose";

const PersonnelSVCSchema = new mongoose.Schema(
    {
        personnel_brsvc: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
    },
    { timestamps: true, collection: 'personnel_svc' }
);

const Personnel_SVC = mongoose.model("Personnel_SVC", PersonnelSVCSchema);
export default Personnel_SVC;
