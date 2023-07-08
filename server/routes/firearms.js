import express from "express";
import {
  getFireArm,
  getFireArms,
  getFireArmID,
  getFireArmIDLog,
  saveFireArm,
  updateFireArm,
  updateAvailability,
  deleteFireArms
} from "../controllers/firearms.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/selected/:firearms_serialno", verifyToken, getFireArmID);
router.get("/selectedlog/:firearms_serialno", verifyToken, getFireArmIDLog);
router.get("/:_id", verifyToken, getFireArm);
router.get("/", verifyToken, getFireArms)
router.post("/", verifyToken, saveFireArm);
router.put('/:_id', verifyToken, updateFireArm);
router.put('/setavailability/:_id', verifyToken, updateAvailability);
router.delete('/:_id', verifyToken, deleteFireArms);

export default router;
