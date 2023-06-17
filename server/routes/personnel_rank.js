import express from "express";
import {
    getPersonnelsRank,
} from "../controllers/personnel_rank.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getPersonnelsRank)

export default router;
