import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register User Execution */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // Check if the email address is already registered
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // Return an error response to the client
      return res.status(409).json({ message: 'Email address already registered' });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Login Controller Execution */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // Email Does not exist
    if (!user) {
      return res.status(400).json({ msg: "User does not exist. " });
    }
    // Check user password if match
    const isMatch = await bcrypt.compare(password, user.password);
    // return invalid credentials if not match
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials. " });
    }
    //execute jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    //output token and user data
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Update User Execution */
export const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
    } = req.body;

    const updatedUser = {
      firstName,
      lastName,
      email,
      role
    };

    // Check if the email address is already registered
    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.params._id },
    });
    if (existingUser) {
      // Return an error response to the client
      return res.status(409).json({ message: 'Email address already registered' });
    }

    const savedUser = await User.findByIdAndUpdate(req.params._id, updatedUser, { new: true });
    if (!savedUser) {
      // Return an error response if the user is not found
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Delete User Execution */
export const deleteUser = async (req, res) => {
  try {
  const deletedUser = await User.findByIdAndDelete(req.params._id);
  if (!deletedUser) {
  // Return an error response if the user is not found
  return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
  res.status(500).json({ error: err.message });
  }
  };
