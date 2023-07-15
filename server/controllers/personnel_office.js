import Personnel_Office from "../models/Personnel_Office.js";

/* Get all users */
export const getPersonnelsOffice = async (req, res) => {
  try {
    const personnel_office = await Personnel_Office.find({}, { personnel_office: 1, _id: 0 });
    const renamedData = personnel_office.map(item => {
      return {
        personnel_office: item.personnel_office
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