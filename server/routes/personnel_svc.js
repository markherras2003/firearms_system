import express from "express";
import {
    getPersonnelsSVC,
} from "../controllers/personnel_svc.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getPersonnelsSVC)

export default router;
