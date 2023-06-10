import Roles from '../models/Role.js';

// function to get all roles
export const getAllRoles = async (req, res) => {

  try {
    // Find all permissions and return only the _id and name fields
    const roles = await Roles.find({}, '_id name permissions');

    const data = {
      "data": roles
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// function to get all roles
export const getRolesName = async (req, res) => {

  try {
    // Find all roles and return only the name field, excluding the _id field
    const roles = await Roles.find({}, { _id: 0, name: 1 });

    const data = {
      "data": roles
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllRolesState = async (req, res) => {
  try {
    const roles = await Roles.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Save Role Execution */
export const saveRole = async (req, res) => {
  try {
    const {
      name,
      permissions,
    } = req.body;

    const newRole = new Roles({
      name,
      permissions,
    });
    const saveRole = await newRole.save();
    res.status(200).json(saveRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Update Role Execution */
export const updateRole = async (req, res) => {
  try {
    const {
      _id,
      name,
      permissions,
    } = req.body;

    const updateRoles = {
      _id,
      name,
      permissions,
    };

    const saveRole = await Roles.findByIdAndUpdate(req.params._id, updateRoles, { new: true });
    if (!saveRole) {
      return res.status(404).json({ message: 'Role Not found' });
    }
    res.status(200).json(saveRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Delete Role Execution */
export const deleteRole = async (req, res) => {
  try {
    const deleteRole = await Roles.findByIdAndDelete(req.params._id);
    if (!deleteRole) {
      return res.status(404).json({ message: 'Not not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};