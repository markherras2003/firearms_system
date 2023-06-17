import PersonnelRank from "../models/Personnel_Rank.js";

/* Get all users */
export const getPersonnelsRank = async (req, res) => {
  try {
    const personnel_rank = await PersonnelRank.find({}, { personnel_rank: 1, _id: 0 });
    const renamedData = personnel_rank.map(item => {
      return {
        personnel_rank: item.personnel_rank
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