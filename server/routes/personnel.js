import express from "express";
import {
  getPersonnel,
  getPersonnels,
  getPersonnelsDropdown,
  savePersonnel,
  updatePersonnel,
  deletePersonnel
} from "../controllers/personnel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:_id", verifyToken, getPersonnel);
router.get("/", verifyToken, getPersonnels)
router.get("/mydata/:_id", getPersonnelsDropdown)
router.post("/", verifyToken, savePersonnel);
router.put('/:_id', verifyToken, updatePersonnel);
router.delete('/:_id', verifyToken, deletePersonnel);

export default router;
