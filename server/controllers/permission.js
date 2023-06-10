import Permission from '../models/Permission.js';

export const getAllPermissions = async (req, res) => {
  try {
    const permissions1 = await Permission.find({}, '_id name permissions description');

    const formattedPermissions = permissions1.map(permission => {
      const { _id, name, description } = permission;
      return { _id, name, description };
    });

    const data = {
      "data": formattedPermissions
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllPermissionsState = async (req, res) => {
  try {
    const permission = await Permission.find();
    res.status(200).json(permission);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




/* Role Execution */
export const savePermission = async (req, res) => {
  try {

    const {
      name,
      description,
    } = req.body;

    const newPermission = new Permission({
      name,
      description,
    });
    const savePermission = await newPermission.save();
    res.status(200).json(savePermission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/* Update Permission Execution */
export const updatePermission = async (req, res) => {
  try {
    const {
      _id,
      name,
      description,
    } = req.body;

    const updatePermission = {
      _id,
      name,
      description,
    };

    const savePermission = await Permission.findByIdAndUpdate(req.params._id, updatePermission, { new: true });
    if (!savePermission) {
      // Return an error response if the user is not found
      return res.status(404).json({ message: 'Permission Not found' });
    }
    res.status(200).json(savePermission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




/* Delete Role Execution */
export const deletePermission = async (req, res) => {
  try {
  const deletePermission = await Permission.findByIdAndDelete(req.params._id);
  if (!deletePermission) {
  // Return an error response if the user is not found
  return res.status(404).json({ message: 'Not not found' });
  }
  res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
  res.status(500).json({ error: err.message });
  }
  };