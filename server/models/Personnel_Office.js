import mongoose from "mongoose";

const PersonnelOfficeSchema = new mongoose.Schema(
    {
        personnel_office: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
    },
    { timestamps: true, collection: 'personnel_office' }
);

const Personnel_Office = mongoose.model("Personnel_Office", PersonnelOfficeSchema);
export default Personnel_Office;
