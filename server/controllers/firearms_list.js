import Firearms_List from "../models/Firearms_List.js";

/* Get all users */
export const getFirearmsList = async (req, res) => {
  try {
    const firearms_type = await Firearms_List.find({}, { firearms: 1, _id: 0 });
    const renamedData = firearms_type.map(item => {
      return {
        firearms: item.firearms
      };
    });
    const data = {
      "data": renamedData
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};