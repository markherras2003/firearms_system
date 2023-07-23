import FireArmsMonitor from "../models/FireArmsMonitor.js";
import Personnel from "../models/Personnel.js";
import FireArms from "../models/FireArms.js";
import FireArmsMonitorLog from "../models/FireArmsMonitorLog.js";

/* Get Job Order value by id params */
export const getFireArmMonitoring = async (req, res) => {
  try {
    const { id } = req.params;
    const firearm = await FireArmsMonitor.findById(id);
    res.status(200).json(firearm);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Get all Personnels */
export const getFireArmsMonitoring = async (req, res) => {
  try {
    const firearms = await FireArmsMonitor.find();
    /*const personnel = await Personnel.findById(firearms.personnel_id);
    console.log(firearms.personnel_id );
    */

     // Iterate over each item in the firearms array
  const data = await Promise.all(firearms.map(async (firearm,index) => {
    const personnel = await Personnel.findOne({"personnel_id": firearm.personnel_id});
    const fire_arms = await FireArms.findOne({"firearms_id": firearm.firearms_id})

    const checkInDate = firearm.check_in ? new Date(firearm.check_in) : null;
    const checkOutDate = firearm.check_out ? new Date(firearm.check_out) : null;
    const formattedCheckIn = checkInDate ? checkInDate.toLocaleString() : "";
    const formattedCheckOut = checkOutDate ? checkOutDate.toLocaleString() : "";
    return {
      series_count: index + 1, // Series count starts from 1
      _id: firearm._id,
      firearms_id: firearm.firearms_id,
      firearms_monitor_id: firearm.firearms_monitor_id,
      personnel_id: firearm.personnel_id,
      firearms_id: firearm.firearms_id,
      firearms_purpose:firearm.firearms_purpose,
      firearms_status:firearm.firearms_status,
      firearms_serialno: firearm.firearms_serialno,
      firearms_qrcode: firearm.firearms_qrcode,
      check_in: formattedCheckIn,
      check_out: formattedCheckOut,
      personnel,
      fire_arms
    };
  }));

res.status(200).json({ data });

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* Job Order Save Executions */
export const saveFireArmMonitoring = async (req, res) => {
  try {
    const lastNumber = await FireArmsMonitor.findOne().sort({ firearms_monitor_id: -1 });
    const nextNumberID = lastNumber ? lastNumber.firearms_monitor_id + 1 : 1001;

    const {
      firearms_monitor_id,
      personnel_id,
      firearms_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_purpose,
      firearms_status,
      check_in,
      check_out,
    } = req.body;

    const newFireArm = new FireArmsMonitor({
      firearms_monitor_id: nextNumberID,
      personnel_id,
      firearms_id,
      firearms_serialno,
      firearms_qrcode,
      firearms_purpose,
      firearms_status,
      check_in,
      check_out,
    });

    const savedFireArm = await newFireArm.save();
    res.status(200).json(savedFireArm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Update Job Order Execution */
export const updateFireArmMonitoring = async (req, res) => {
  try {
    const {
      check_in,
      check_out,
    } = req.body;

    const updateFireArms = {
      check_in,
      check_out,
    };

    const saveFireArm = await FireArmsMonitor.findByIdAndUpdate(req.params._id, updateFireArms, { new: true });
    if (!saveFireArm) {
      return res.status(404).json({ message: 'Fire Arms not found' });
    }
    res.status(200).json(saveFireArm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Delete Job Order Execution */
export const deleteFireArmsMonitoring = async (req, res) => {
  try {
    const deletedFirearms = await FireArmsMonitor.findByIdAndDelete(req.params._id);
    if (!deletedFirearms) {
      return res.status(404).json({ message: 'Fire Arms Not not found' });
    }
    res.status(200).json({ message: 'Fire Arms Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};