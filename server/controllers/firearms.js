import FireArms from "../models/FireArms.js";
import Personnel from "../models/Personnel.js";
import FireArmsMonitor from "../models/FireArmsMonitor.js";
import FireArmsMonitorLog from "../models/FireArmsMonitorLog.js";
import { ObjectId } from 'mongodb';

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

/* Get Job Order value by id params */
export const getFireArmID = async (req, res) => {
  try {
    const { firearms_serialno } = req.params;
    const firearms = await FireArms.find({ "firearms_serialno": firearms_serialno });
    // Iterate over each item in the firearms array
    const data = await Promise.all(firearms.map(async (firearm) => {
      const personnel = await Personnel.findOne({ "personnel_id": firearm.personnel_id });
      const firearms_monitor = await FireArmsMonitor.findOne({
        "firearms_serialno": firearm.firearms_serialno,
      });
      return {
        _id: firearm._id,
        firearms: firearm.firearms,
        firearms_id: firearm.firearms_id,
        personnel_id: firearm.personnel_id,
        firearms_buttnumber: firearm.firearms_buttnumber,
        firearms_serialno: firearm.firearms_serialno,
        firearms_qrcode: firearm.firearms_qrcode,
        firearms_status: firearm.firearms_status,
        firearms_purpose: firearm.firearms_purpose,
        firearms_isperson: firearm.firearms_isperson,
        firearms_availability: firearm.firearms_availability,
        firearms_monitor,
        personnel,
      };
    }));

    res.status(200).json({ data });

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getFireArmIDLog = async (req, res) => {
  try {
    const { firearms_serialno } = req.params;
    const firearms = await FireArms.find({ "firearms_serialno": firearms_serialno });
    // Iterate over each item in the firearms array
    const data = await Promise.all(firearms.map(async (firearm) => {
      const personnel = await Personnel.findOne({ "personnel_id": firearm.personnel_id });
      const firearms_monitor = await FireArmsMonitorLog.findOne({
        "firearms_serialno": firearm.firearms_serialno,
      });
      return {
        _id: firearm._id,
        firearms: firearm.firearms,
        firearms_buttnumber: firearm.firearms_buttnumber,
        firearms_id: firearm.firearms_id,
        personnel_id: firearm.personnel_id,
        firearms_serialno: firearm.firearms_serialno,
        firearms_qrcode: firearm.firearms_qrcode,
        firearms_status: firearm.firearms_status,
        firearms_purpose: firearm.firearms_purpose,
        firearms_isperson: firearm.firearms_isperson,
        firearms_availability: firearm.firearms_availability,
        firearms_monitor,
        personnel,
      };
    }));

    res.status(200).json({ data });

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



/* Get all Personnels */
export const getFireArms = async (req, res) => {
  try {
    /*const firearms = await FireArms.find();
    const data = firearms.map(({
      _id,
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
      firearms_availability,
      createdAt
    }) => ({
      _id,
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_status,
      firearms_isperson,
      firearms_availability,
      createdAt: createdAt.toISOString().split('T')[0]
    }));
    res.status(200).json({ data });

*/
    const firearms = await FireArms.find();
    // Iterate over each item in the firearms array
    const data = await Promise.all(firearms.map(async (firearm, index) => {
      const personnel = await Personnel.findOne({ "personnel_id": firearm.personnel_id });

      return {
        series_count: index + 1, // Series count starts from 1
        _id: firearm._id,
        firearms: firearm.firearms,
        personnel_id: firearm.personnel_id,
        firearms_serialno: firearm.firearms_serialno,
        firearms_qrcode: firearm.firearms_qrcode,
        firearms_buttnumber: firearm.firearms_buttnumber,
        firearms_status: firearm.firearms_status,
        firearms_isperson: firearm.firearms_isperson,
        firearms_availability: firearm.firearms_availability,
        personnel,
      };
    }));

    res.status(200).json({ data });

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* Job Order Save Executions */
export const saveFireArm = async (req, res) => {
  try {
    const lastNumber = await FireArms.findOne().sort({ firearms_id: -1 });
    const nextNumberID = lastNumber ? lastNumber.firearms_id + 1 : 1001;

    const {
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_id,
      firearms_isperson,
      firearms_buttnumber,
      firearms_availability,
    } = req.body;

    const newFireArm = new FireArms({
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_id: nextNumberID,
      firearms_isperson,
      firearms_buttnumber,
      firearms_availability
    });

    const savedFireArm = await newFireArm.save();
    const _id = savedFireArm._id;
    const firearmss = await FireArms.find({ _id });
    const data = await Promise.all(firearmss.map(async (firearm) => {
      const personnel = await Personnel.findOne({ personnel_id: firearm.personnel_id });

      return {
        _id: firearm._id,
        firearms: firearm.firearms,
        personnel_id: firearm.personnel_id,
        firearms_serialno: firearm.firearms_serialno,
        firearms_qrcode: firearm.firearms_qrcode,
        firearms_status: firearm.firearms_status,
        firearms_isperson: firearm.firearms_isperson,
        firearms_buttnumber: firearm.firearms_buttnumber,
        firearms_availability: firearm.firearms_availability,
        personnel,
      };
    }));

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Update Job Order Execution */
export const updateFireArm = async (req, res) => {
  try {
    const {
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_isperson,
      firearms_buttnumber,
      firearms_availability
    } = req.body;

    const updateFireArms = {
      firearms,
      personnel_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_isperson,
      firearms_buttnumber,
      firearms_availability
    };

    const saveFireArm = await FireArms.findByIdAndUpdate(req.params._id, updateFireArms, { new: true });
    if (!saveFireArm) {
      return res.status(404).json({ message: 'Fire Arms not found' });
    }
    res.status(200).json(saveFireArm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Update Job Order Execution */
export const updateAvailability = async (req, res) => {
  try {
    const { firearms_availability } = req.body;
    const updateFireArms = { firearms_availability };
    const firearmsId = req.params._id;

    const saveFireArm = await FireArms.findByIdAndUpdate(firearmsId, updateFireArms, { new: true });

    if (!saveFireArm) {
      return res.status(404).json({ message: 'Fire Arms not found' });
    }

    res.status(200).json(saveFireArm);
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