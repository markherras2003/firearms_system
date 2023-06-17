import mongoose from "mongoose";

const PersonnelRankSchema = new mongoose.Schema(
    {
        personnel_rank: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
    },
    { timestamps: true, collection: 'personnel_ranks' }
);

const Personnel_Rank = mongoose.model("Personnel_Rank", PersonnelRankSchema);
export default Personnel_Rank;
