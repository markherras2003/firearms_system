import JobOrder from "../models/JobOrder.js";

/* Get Job Order value by id params */
export const getJobOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const joborders = await JobOrder.findById(id);
    res.status(200).json(joborder);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Get all Job Orders */
export const getJobOrders = async (req, res) => {
  try {
    const joborders = await JobOrder.find();
    const data = joborders.map(({
      _id: id,
      job_id,
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no,
      createdAt
    }) => ({
      id,
      job_id,
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no,
      createdAt: createdAt.toISOString().split('T')[0]
    }));
    res.status(200).json({ data });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* Job Order Save Executions */
export const saveJobOrder = async (req, res) => {
  try {
    const lastJobOrder = await JobOrder.findOne().sort({ job_id: -1 });
    const nextJobId = lastJobOrder ? lastJobOrder.job_id + 1 : 1001;

    const {
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no
    } = req.body;

    const newJobOrder = new JobOrder({
      job_id: nextJobId,
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no
    });

    const savedJob = await newJobOrder.save();
    res.status(200).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Update Job Order Execution */
export const updateJobOrder = async (req, res) => {
  try {
    const {
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no
    } = req.body;

    const updateJobOrders = {
      client_name,
      unit_description,
      unit_model,
      unit_accessories,
      unit_problem,
      resolution,
      received_by,
      job_order_by,
      tech_incharge,
      phone_no
    };

    const saveJob = await JobOrder.findByIdAndUpdate(req.params._id, updateJobOrders, { new: true });
    if (!saveJob) {
      return res.status(404).json({ message: 'Job Order not found' });
    }
    res.status(200).json(saveJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* Delete Job Order Execution */
export const deleteJobOrder = async (req, res) => {
  try {
    const deletedJob = await JobOrder.findByIdAndDelete(req.params._id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job Order Not not found' });
    }
    res.status(200).json({ message: 'Job Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};