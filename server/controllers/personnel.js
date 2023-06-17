import Personnel from "../models/Personnel.js";

/* Get Job Order value by id params */
export const getPersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const personnel = await Personnel.findById(id);
    res.status(200).json(personnel);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Get all Personnels */
export const getPersonnels = async (req, res) => {
  try {
    const personnels = await Personnel.find();
    const data = personnels.map(({
      _id,
      personnel_id,
      serial_no,
      fullname,
      personnel_rank,
      personnel_brsvc,
      personnel_email,
      createdAt
    }) => ({
      _id,
      personnel_id,
      serial_no,
      fullname,
      personnel_rank,
      personnel_brsvc,
      personnel_email,
      createdAt: createdAt.toISOString().split('T')[0]
    }));
    res.status(200).json({ data });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* Job Order Save Executions */
export const savePersonnel = async (req, res) => {
  try {
    const lastNumber = await Personnel.findOne().sort({ personnel_id: -1 });
    const nextNumberID = lastNumber ? lastNumber.personnel_id + 1 : 1001;

    const {
      fullname,
      serial_no,
      personnel_rank,
      personnel_brsvc,
      personnel_email
    } = req.body;

    const newPersonnel = new Personnel({
      personnel_id: nextNumberID,
      fullname,
      serial_no,
      personnel_rank,
      personnel_brsvc,
      personnel_email
    });

    const savedPersonnel = await newPersonnel.save();
    res.status(200).json(savedPersonnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Update Job Order Execution */
export const updatePersonnel = async (req, res) => {
  try {
    const {
        fullname,
        serial_no,
        personnel_rank,
        personnel_brsvc,
        personnel_email
    } = req.body;

    const updatePersonnels = {
        fullname,
        serial_no,
        personnel_rank,
        personnel_brsvc,
        personnel_email
    };

    const savePersonnel = await Personnel.findByIdAndUpdate(req.params._id, updatePersonnels, { new: true });
    if (!savePersonnel) {
      return res.status(404).json({ message: 'Personnel not found' });
    }
    res.status(200).json(savePersonnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Delete Job Order Execution */
export const deletePersonnel = async (req, res) => {
  try {
    const deletedPersonnel = await Personnel.findByIdAndDelete(req.params._id);
    if (!deletedPersonnel) {
      return res.status(404).json({ message: 'Personnel Not not found' });
    }
    res.status(200).json({ message: 'Personnel Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};