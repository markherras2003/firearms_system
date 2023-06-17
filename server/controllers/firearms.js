import FireArms from "../models/FireArms.js";

/* Get Job Order value by id params */
export const getFireArm = async (req, res) => {
  try {
    const { id } = req.params;
    const firearm = await FireArms.findById(id);
    res.status(200).json(firearm);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Get all Personnels */
export const getFireArms = async (req, res) => {
  try {
    const firearms = await FireArms.find();
    const data = firearms.map(({
      _id,
      firearms,
      serial_no,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
      createdAt
    }) => ({
      _id,
      firearms,
      serial_no,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
      createdAt: createdAt.toISOString().split('T')[0]
    }));
    res.status(200).json({ data });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* Job Order Save Executions */
export const saveFireArm = async (req, res) => {
  try {
    const lastNumber = await FireArms.findOne().sort({ firearms_serialno: -1 });
    const nextNumberID = lastNumber ? lastNumber.firearms_serialno + 1 : 1001;

    const {
      firearms,
      serial_no,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
    } = req.body;

    const newFireArm = new FireArms({
      firearms,
      serial_no,
      firearms_serialno :nextNumberID,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
    });

    const savedFireArm = await newFireArm.save();
    res.status(200).json(savedFireArm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Update Job Order Execution */
export const updateFireArm = async (req, res) => {
  try {
    const {
      firearms,
      serial_no,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
    } = req.body;

    const updateFireArms = {
      firearms,
      serial_no,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
    };

    const saveFireArm = await FireArms.findByIdAndUpdate(req.params._id, updateFireArms, { new: true });
    if (!saveFireArm) {
      return res.status(404).json({ message: 'Fire Arms not found' });
    }
    res.status(200).json(savePersonnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Delete Job Order Execution */
export const deleteFireArms = async (req, res) => {
  try {
    const deletedFirearms = await FireArms.findByIdAndDelete(req.params._id);
    if (!deletedFirearms) {
      return res.status(404).json({ message: 'Fire Arms Not not found' });
    }
    res.status(200).json({ message: 'Fire Arms Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};