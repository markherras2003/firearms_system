import express from "express";
import { login , register , updateUser,deleteUser } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
// Execute Register Data
router.post("/register",verifyToken, register);
router.put('/users/:_id',verifyToken, updateUser);
router.delete('/users/:_id',verifyToken, deleteUser);

export default router;
