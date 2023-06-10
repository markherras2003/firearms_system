import User from "../models/User.js";

/* Get user value by ID */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Get all users */
export const getUsers = async (req, res) => {
  try {
      // Find all permissions and return only the _id and name fields
      const users = await User.find();
      const data = {
        "data": users
      };
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

