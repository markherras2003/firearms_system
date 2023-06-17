import PersonnelSVC from "../models/Personnel_SVC.js";


/* Get all users */
export const getPersonnelsSVC = async (req, res) => {
  try {
      const personnel_brsvc = await PersonnelSVC.find({}, { personnel_brsvc: 1, _id: 0 });
      const renamedData = personnel_brsvc.map(item => {
        return {
          personnel_brsvc: item.personnel_brsvc
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