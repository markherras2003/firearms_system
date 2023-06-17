import express from "express";
import {
  getPersonnel,
  getPersonnels,
  savePersonnel,
  updatePersonnel,
  deletePersonnel
} from "../controllers/personnel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:_id", verifyToken, getPersonnel);
router.get("/", verifyToken, getPersonnels)
router.post("/", verifyToken, savePersonnel);
router.put('/:_id', verifyToken, updatePersonnel);
router.delete('/:_id', verifyToken, deletePersonnel);

export default router;
