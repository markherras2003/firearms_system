import express from "express";
import {
  getUser,
  getUsers
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*  Get List of user per ID with jwt verify token */
router.get("/:id", verifyToken, getUser);

router.get("",verifyToken ,getUsers)

export default router;
