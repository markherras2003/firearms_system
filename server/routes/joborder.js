import express from "express";
import {
  getJobOrder,
  getJobOrders,
  saveJobOrder,
  updateJobOrder,
  deleteJobOrder
} from "../controllers/joborder.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:_id", verifyToken, getJobOrder);
router.get("/", verifyToken, getJobOrders)
router.post("/", verifyToken, saveJobOrder);
router.put('/:_id', verifyToken, updateJobOrder);
router.delete('/:_id', verifyToken, deleteJobOrder);

export default router;
