import express from "express";
import {
  getFireArmMonitoring,
  getFireArmsMonitoring,
  saveFireArmMonitoring,
  updateFireArmMonitoring,
  deleteFireArmsMonitoring
} from "../controllers/firearmsmonitoring.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:_id", verifyToken, getFireArmMonitoring);
router.get("/", verifyToken, getFireArmsMonitoring)
router.post("/", verifyToken, saveFireArmMonitoring);
router.put('/:_id', verifyToken, updateFireArmMonitoring);
router.delete('/:_id', verifyToken, deleteFireArmsMonitoring);

export default router;
