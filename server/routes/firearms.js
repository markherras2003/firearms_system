import express from "express";
import {
  getFireArm,
  getFireArms,
  getFireArmID,
  saveFireArm,
  updateFireArm,
  deleteFireArms
} from "../controllers/firearms.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/selected/:firearms_serialno", verifyToken, getFireArmID);
router.get("/:_id", verifyToken, getFireArm);
router.get("/", verifyToken, getFireArms)
router.post("/", verifyToken, saveFireArm);
router.put('/:_id', verifyToken, updateFireArm);
router.delete('/:_id', verifyToken, deleteFireArms);

export default router;
