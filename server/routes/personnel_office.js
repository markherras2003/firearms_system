import express from "express";
import {
    getPersonnelsOffice,
} from "../controllers/personnel_office.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getPersonnelsOffice)

export default router;
