import mongoose from "mongoose";

const FirearmsListSchema = new mongoose.Schema(
    {
        firearms: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
    },
    { timestamps: true, collection: 'firearms_list' }
);

const Firearms_List = mongoose.model("Firearms_List", FirearmsListSchema);
export default Firearms_List;
