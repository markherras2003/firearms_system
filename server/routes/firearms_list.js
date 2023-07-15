import express from "express";
import {
    getFirearmsList,
} from "../controllers/firearms_list.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFirearmsList)

export default router;
